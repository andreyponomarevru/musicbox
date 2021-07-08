import Joi from "joi";

import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";
import { TrackExtended } from "../../public/track/track-extended";
import { ParsedTrack } from "../../../types";

//
// Queries used only locally (not exposed through the controller), for adding
// tracks to the database while scanning the local disk i.e. they are not used
// by public API
//

const SUPPORTED_CODEC = (process.env.SUPPORTED_CODEC as string)
  .split(",")
  .map((name) => name.toLowerCase());

const schemaParsedTrack = Joi.object<ParsedTrack>({
  filePath: Joi.string().min(1).max(255).allow(null).required(),
  extension: Joi.string()
    .valid(...SUPPORTED_CODEC)
    .required(),
  trackArtist: Joi.array()
    .items(Joi.string().min(1).max(200).required())
    .required(),
  releaseArtist: Joi.string().min(1).max(200).required(),
  duration: Joi.number().min(0).required(),
  bitrate: Joi.number().min(0).allow(null).required(),
  year: Joi.number().integer().min(0).max(9999).required(),
  trackNo: Joi.number().allow(null).required(),
  trackTitle: Joi.string().min(1).max(200).required(),
  releaseTitle: Joi.string().min(1).max(200).required(),
  diskNo: Joi.number().allow(null).required(),
  label: Joi.string().min(1).max(200).required(),
  genre: Joi.array().items(Joi.string().min(1).max(200).required()).required(),
  coverPath: Joi.string().required(),
  catNo: Joi.allow(null).required(),
});

//

export async function create(meta: ParsedTrack): Promise<TrackExtended> {
  const newTrack = await schemaParsedTrack.validateAsync(meta);

  const pool = await connectDB();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertYearQuery = {
      text: "\
				WITH \
					input_rows (tyear) AS ( \
						VALUES ($1::smallint) \
					), \
					ins AS ( \
						INSERT INTO \
							tyear (tyear) \
						SELECT \
							tyear \
						FROM \
							input_rows \
						ON CONFLICT DO NOTHING \
						RETURNING tyear_id \
					) \
        \
				SELECT \
					tyear_id \
				FROM \
					ins \
        \
        UNION ALL \
        \
				SELECT \
					t.tyear_id \
				FROM \
					input_rows \
        JOIN tyear AS t \
				USING (tyear); \
			",
      values: [newTrack.year],
    };
    const { tyear_id } = (await client.query(insertYearQuery)).rows[0];

    const insertExtensionQuery = {
      text: "\
				WITH \
          input_rows (name) AS ( \
            VALUES ($1) \
          ), \
          ins AS ( \
						INSERT INTO \
							extension (name) \
						SELECT \
							name \
						FROM \
							input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING extension_id \
          ) \
        \
				SELECT \
					extension_id \
				FROM \
					ins \
        \
        UNION ALL \
        \
				SELECT \
					e.extension_id \
				FROM \
					input_rows \
        JOIN extension AS e \
        USING (name);",
      values: [newTrack.extension],
    };
    const { extension_id } = (await client.query(insertExtensionQuery)).rows[0];

    const insertLabelQuery = {
      text: "\
				WITH \
          input_rows (name) AS ( \
            VALUES ($1) \
          ), \
          ins AS ( \
						INSERT INTO \
							label (name) \
						SELECT \
							name \
						FROM \
							input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING label_id \
          ) \
          \
				SELECT \
					label_id \
				FROM \
					ins \
        \
        UNION ALL \
        \
				SELECT \
					l.label_id \
				FROM \
					input_rows \
        JOIN label AS l \
        USING (name);",
      values: [newTrack.label],
    };
    const { label_id } = (await client.query(insertLabelQuery)).rows[0];

    const insertReleaseArtist = {
      text: "\
					WITH \
            input_rows (name) AS ( \
              VALUES ($1) \
            ), \
            ins AS ( \
							INSERT INTO \
								artist (name) \
							SELECT \
								name \
							FROM \
								input_rows \
              ON CONFLICT DO NOTHING \
              RETURNING artist_id \
            ) \
          \
					SELECT \
						artist_id \
					FROM \
						ins \
          \
          UNION ALL \
          \
					SELECT \
						a.artist_id \
					FROM \
						input_rows \
					JOIN \
					  artist AS a \
          USING (name);",
      values: [newTrack.releaseArtist],
    };
    const { artist_id: releaseArtistId } = (
      await client.query(insertReleaseArtist)
    ).rows[0];

    const insertReleaseQuery = {
      text: "\
				WITH \
          input_rows (tyear_id, label_id, cat_no, title, cover_path, artist_id) AS ( \
            VALUES ($1::integer, $2::integer, $3, $4, $5, $6::integer) \
          ), \
          \
          ins AS ( \
						INSERT INTO \
							release ( \
								tyear_id, \
								label_id, \
								cat_no, \
								title, \
								cover_path, \
								artist_id\
							) \
						SELECT \
							tyear_id, \
							label_id, \
							cat_no, \
							title, \
							cover_path, \
							artist_id \
						FROM \
							input_rows \
            ON CONFLICT DO NOTHING \
						RETURNING \
						  release_id \
          ) \
        \
				SELECT \
					release_id \
				FROM \
					ins \
        \
        UNION ALL \
        \
				SELECT \
					r.release_id \
				FROM \
					input_rows \
        JOIN release AS r \
				USING (cat_no);\
			",
      values: [
        tyear_id,
        label_id,
        newTrack.catNo,
        newTrack.releaseTitle,
        newTrack.coverPath,
        releaseArtistId,
      ],
    };
    const { release_id } = (await client.query(insertReleaseQuery)).rows[0];

    const insertTrackQuery = {
      text: "\
				INSERT INTO track ( \
          extension_id, \
          release_id, \
          disk_no, \
          track_no, \
          title, \
          bitrate, \
          duration, \
          file_path \
        ) \
        VALUES (\
          $1::integer, \
          $2::integer, \
          $3::smallint, \
          $4::smallint, \
          $5, \
          $6::numeric, \
          $7::numeric, \
          $8 \
        ) \
				RETURNING track_id\
			",
      values: [
        extension_id,
        release_id,
        newTrack.diskNo,
        newTrack.trackNo,
        newTrack.trackTitle,
        newTrack.bitrate,
        newTrack.duration,
        newTrack.filePath,
      ],
    };
    const { track_id } = (await client.query(insertTrackQuery)).rows[0];

    for (const genre of newTrack.genre) {
      const insertGenreQuery = {
        text: "\
					WITH \
            input_rows (name) AS ( \
              VALUES ($1) \
            ), \
            \
            ins AS ( \
              INSERT INTO genre (name) \
							SELECT \
								name \
							FROM \
								input_rows \
              ON CONFLICT DO NOTHING \
              RETURNING genre_id \
            ) \
          \
					SELECT \
						genre_id \
          FROM ins \
          \
          UNION ALL \
          \
					SELECT \
						g.genre_id \
					FROM \
						input_rows \
          JOIN genre AS g \
					USING (name);\
				",
        values: [genre],
      };
      const { genre_id } = (await client.query(insertGenreQuery)).rows[0];

      const inserTrackGenreQuery = {
        text: "\
					INSERT INTO \
						track_genre (track_id, genre_id) \
					VALUES \
						($1::integer, $2::integer) \
           ON CONFLICT DO NOTHING",
        values: [track_id, genre_id],
      };
      await client.query(inserTrackGenreQuery);
    }

    for (const trackArtist of newTrack.trackArtist) {
      const insertArtistQuery = {
        text: "\
					WITH \
          	input_rows (name) AS ( \
          	  VALUES ($1) \
          	), \
          \
          ins AS ( \
						INSERT INTO \
							artist (name) \
						SELECT \
							name \
						FROM \
							input_rows \
            ON CONFLICT DO NOTHING \
						RETURNING \
						  artist_id \
          ) \
          \
					SELECT \
						artist_id \
					FROM \
						ins \
          \
          UNION ALL \
          \
					SELECT \
						a.artist_id \
					FROM \
						input_rows \
					JOIN \
					  artist AS a \
          USING (name);",
        values: [trackArtist],
      };
      const { artist_id } = (await client.query(insertArtistQuery)).rows[0];

      const inserTrackArtistQuery = {
        text: "\
					INSERT INTO \
						track_artist (track_id, artist_id) \
					VALUES \
						($1::integer, $2::integer) \
					ON CONFLICT DO NOTHING;\
				",
        values: [track_id, artist_id],
      };
      await client.query(inserTrackArtistQuery);
    }

    await client.query("COMMIT");

    const track = new TrackExtended({
      file_path: newTrack.filePath,
      extension: newTrack.extension,
      track_artist: newTrack.trackArtist,
      release_artist: newTrack.releaseArtist,
      duration: newTrack.duration,
      bitrate: newTrack.bitrate,
      year: newTrack.year,
      track_no: newTrack.track_no,
      track_title: newTrack.track_title,
      release_title: newTrack.release_title,
      disk_no: newTrack.disk_no,
      label: newTrack.label,
      genre: newTrack.genre,
      cover_path: newTrack.cover_path,
      cat_no: newTrack.catNo,
      track_id,
      release_id,
    });

    return track;
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error(
      `${__filename}: ROLLBACK. Error occured while adding track "${newTrack.filePath}" to database.`,
    );
    throw err;
  } finally {
    client.release();
  }
}
