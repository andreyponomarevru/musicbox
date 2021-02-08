import util from "util";

import Joi from "joi";

import { Track } from "./../track/localTrack";
import { HttpError } from "../../utility/http-errors/HttpError";
import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";
import { ReleaseMetadata, ReleaseCollectionItemMetadata } from "../../types";
import { Release } from "./Release";
import { ReleaseCollectionItem } from "./ReleaseCollectionItem";
import {
  SORT_COLUMNS,
  PER_PAGE_NUMS,
  SORT_ORDER,
} from "../../utility/constants";
import { DBError } from "../../utility/db-errors/DBError";

/*
 * Queries used only locally (not exposed through the controller), for adding
 * tracks to the database while scanning the local disk i.e. they are not used
 * by public REST API
 */

export async function create(metadata: unknown) {
  const schemaCreate = Joi.object({
    artist: Joi.string().min(0).max(200).optional(),
    year: Joi.number().integer().min(0).max(9999).required().optional(),
    title: Joi.string().min(0).max(200).optional(),
    label: Joi.string().min(0).max(200).optional(),
    coverPath: Joi.string().required().optional(),
    catNo: Joi.allow(null).optional(),
  });

  const validatedMetadata: ReleaseMetadata = await schemaCreate.validateAsync(
    metadata,
  );
  const release = new Release(validatedMetadata);

  const pool = await connectDB();
  const client = await pool.connect();

  try {
    const insertYearQuery = {
      text:
        "WITH \
        input_rows (tyear) AS ( \
          VALUES ($1::smallint) \
        ), \
        \
        ins AS ( \
          INSERT INTO tyear (tyear) \
          SELECT tyear \
          FROM input_rows \
          ON CONFLICT DO NOTHING \
          RETURNING tyear_id \
        ) \
        \
        SELECT tyear_id FROM ins \
        \
        UNION ALL \
        \
        SELECT t.tyear_id \
        FROM input_rows \
        JOIN tyear AS t \
        USING (tyear);",
      values: [release.year],
    };
    const { tyear_id } = (await pool.query(insertYearQuery)).rows[0];

    const insertLabelQuery = {
      text:
        "WITH \
          input_rows (name) AS ( \
            VALUES ($1) \
          ), \
          \
          ins AS ( \
            INSERT INTO label (name) \
            SELECT name \
            FROM input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING label_id \
          ) \
          \
        SELECT label_id \
        FROM ins \
        \
        UNION ALL \
        \
        SELECT l.label_id \
        FROM input_rows \
        JOIN label AS l \
        USING (name);",
      values: [release.label],
    };
    const { label_id } = (await pool.query(insertLabelQuery)).rows[0];

    const insertReleaseArtist = {
      text:
        "WITH \
            input_rows (name) AS ( \
              VALUES ($1) \
            ), \
            \
            ins AS ( \
              INSERT INTO artist (name) \
              SELECT name \
              FROM input_rows \
              ON CONFLICT DO NOTHING \
              RETURNING artist_id \
            ) \
          \
          SELECT artist_id \
          FROM ins \
          \
          UNION ALL \
          \
          SELECT a.artist_id \
          FROM input_rows \
          JOIN artist AS a \
          USING (name);",
      values: [release.artist],
    };
    const { artist_id } = (await pool.query(insertReleaseArtist)).rows[0];

    client.query("BEGIN");

    const insertReleaseQuery = {
      text:
        "WITH \
          input_rows (tyear_id, label_id, cat_no, title, cover_path, artist_id) AS ( \
            VALUES ($1::integer, $2::integer, $3, $4, $5, $6::integer) \
          ), \
          \
          ins AS ( \
            INSERT INTO release (tyear_id, label_id, cat_no, title, cover_path, artist_id) \
            SELECT tyear_id, label_id, cat_no, title, cover_path, artist_id \
            FROM input_rows \
            ON CONFLICT DO NOTHING \
            RETURNING release_id \
          ) \
        \
        SELECT release_id \
        FROM ins \
        \
        UNION ALL \
        \
        SELECT r.release_id \
        FROM input_rows \
        JOIN release AS r \
        USING (cat_no);",
      values: [
        tyear_id,
        label_id,
        release.catNo,
        release.title,
        release.coverPath,
        artist_id,
      ],
    };
    const { release_id } = (await pool.query(insertReleaseQuery)).rows[0];

    await client.query("COMMIT");

    release.setId(release_id);
    return release;
  } catch (err) {
    await client.query("ROLLBACK");
    const text = `Can't create release: ${err.stack}`;
    logger.error(text);
    throw new DBError(err.code, err);
  }
}

export async function read(id: number) {
  const pool = await connectDB();

  try {
    const getReleaseTextQuery = {
      text: "SELECT * FROM view_release WHERE id=$1",
      values: [id],
    };
    const releaseMetadata = (await pool.query(getReleaseTextQuery)).rows[0];

    if (!releaseMetadata) return null;
    const release = new Release(releaseMetadata);
    logger.debug(`filePath: ${__filename} \n${util.inspect(release)}`);
    return release;
  } catch (err) {
    logger.error(`${__filename}: Error while reading a release.\n${err.stack}`);
    throw err;
  }
}

export async function readByReleaseId(releaseId: number) {
  const pool = await connectDB();
  console.log(releaseId);
  try {
    const getTracksTextQuery = {
      text:
        'SELECT * FROM view_track WHERE "releaseId"=$1 ORDER BY "trackNo", "diskNo";',
      values: [releaseId],
    };
    const { rows } = await pool.query(getTracksTextQuery);

    if (rows.length === 0) throw new HttpError(404);
    const tracks = rows.map((row) => new Track(row));
    logger.debug(`filePath: ${__filename} \n${util.inspect(tracks)}`);
    return { tracks };
  } catch (err) {
    const text = `${__filename}: Error while reading tracks by release id.\n${err.stack}`;
    logger.error(text);
    throw err;
  }
}

export async function readAll(params: unknown) {
  const schemaReadAllByPages = Joi.object({
    sortBy: Joi.string()
      .valid(...SORT_COLUMNS)
      .optional(),
    sortOrder: Joi.string()
      .valid(...SORT_ORDER)
      .optional(),
    pagination: {
      page: Joi.number().min(1).optional(),
      itemsPerPage: Joi.number()
        .valid(...PER_PAGE_NUMS)
        .optional(),
    },
  });

  let {
    sortBy = SORT_COLUMNS[0],
    sortOrder = SORT_ORDER[0],
    pagination: { page = 1, itemsPerPage = PER_PAGE_NUMS[0] },
  } = await schemaReadAllByPages.validateAsync(params);

  logger.debug(
    `sortBy: ${sortBy} sortOrder: ${sortOrder}, page: ${page}, itemsPerPage: ${itemsPerPage}`,
  );
  const pool = await connectDB();

  try {
    const readReleasesQuery = {
      text: `
        SELECT \
        (SELECT COUNT (*) FROM view_release_short)::integer AS total_count, \
        (SELECT json_agg(t.*) FROM \
          (SELECT * FROM view_release_short \
           ORDER BY \
             CASE WHEN $1 = 'asc' THEN "${sortBy}" END ASC, \
             CASE WHEN $1 = 'asc' THEN 'id' END ASC, \
             CASE WHEN $1 = 'desc' THEN "${sortBy}" END DESC, \
             CASE WHEN $1 = 'desc' THEN 'id' END DESC \
           LIMIT $3::integer \
           OFFSET ($2::integer - 1) * $3::integer \          
           ) AS t) \
        AS releases;
        `,
      values: [sortOrder, page, itemsPerPage],
    };

    const { rows } = await pool.query(readReleasesQuery);

    const releases: ReleaseCollectionItem[] | [] =
      rows[0].releases !== null
        ? rows[0].releases.map(
            (row: ReleaseCollectionItemMetadata) =>
              new ReleaseCollectionItem(row),
          )
        : [];

    const total_pages = Math.ceil(rows[0].total_count / itemsPerPage);

    return {
      total_pages,
      page_number: total_pages === 0 ? null : page,
      total_count: rows[0].total_count,
      previous_page: page > 1 ? page - 1 : null,
      next_page: total_pages > page ? page + 1 : null,
      first_page: total_pages > 0 ? 1 : null,
      last_page: total_pages > 0 ? total_pages : null,
      results: releases,
    };
  } catch (err) {
    logger.error(`Can't read releases names: ${err.stack}`);
    throw err;
  }
}

export async function update(params: unknown) {}

// FIX: Check whether release tracks deleted. Propbably you can copy code from lolcal... delete queries - they will delete tracks cascadingly
export async function destroy(releaseId: number) {
  const pool = await connectDB();
  const client = await pool.connect();

  try {
    const deleteReleaseQuery = {
      // Delete RELEASE ( + corresponding records in linking tables track_genre and track_artist cascadingly)
      text:
        "DELETE FROM release \
         WHERE release_id = $1 \
         RETURNING release_id",
      values: [releaseId],
    };

    const deleteYearQuery = {
      // Try to delete YEAR record if it is not referenced by any records in
      // 'release'
      text:
        "DELETE FROM tyear \
         WHERE tyear_id IN ( \
           SELECT tyear_id \
           FROM tyear \
           WHERE tyear_id \
           NOT IN ( \
             SELECT tyear_id \
             FROM release \
           ) \
        )",
    };

    const deleteLabelQuery = {
      // Try to delete LABEL record if it is not referenced by any records in
      // 'release'
      text:
        "DELETE FROM label \
         WHERE label_id IN ( \
           SELECT label_id \
           FROM label \
           WHERE label_id \
           NOT IN ( \
             SELECT label_id \
             FROM release \
           ) \
         )",
    };

    const deleteExtensionQuery = {
      // Try to delete EXTENSION record if it is not referenced by any records
      // in  'track'
      text:
        "DELETE FROM extension \
         WHERE extension_id IN ( \
           SELECT extension_id \
           FROM extension \
           WHERE extension_id \
           NOT IN ( \
             SELECT extension_id \
             FROM track \
           ) \
         )",
    };

    const deleteGenreQuery = {
      // Try to delete GENRE record if it is not referenced by any records in
      // 'track_genre'
      text:
        "DELETE FROM genre \
         WHERE genre_id IN ( \
           SELECT genre_id \
           FROM genre \
           WHERE genre_id \
           NOT IN ( \
             SELECT genre_id \
             FROM track_genre \
           ) \
         )",
    };

    const deleteArtistQuery = {
      // Try to delete ARTIST record if it is not referenced by any records in
      // track_artist
      text:
        "DELETE FROM artist \
         WHERE artist_id IN ( \
          SELECT artist_id \
          FROM artist \
          WHERE artist.artist_id \
          NOT IN ( \
            SELECT artist_id \
            FROM track_artist \
            UNION \
            SELECT artist_id \
            FROM release \
          ) \
        );",
    };

    await client.query("BEGIN");
    const deletedReleaseId: number = (await client.query(deleteReleaseQuery))
      .rows[0];
    await client.query(deleteYearQuery);
    await client.query(deleteLabelQuery);
    await client.query(deleteExtensionQuery);
    await client.query(deleteGenreQuery);
    await client.query(deleteArtistQuery);
    await client.query("COMMIT");
    return deletedReleaseId;
  } catch (err) {
    await client.query("ROLLBACK");
    const text = `filePath: ${__filename}: Rollback. Can't delete track. Track doesn't exist or an error occured during deletion\n${err.stack}`;
    logger.error(text);
    throw err;
  } finally {
    client.release();
  }
}
