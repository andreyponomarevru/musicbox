import util from "util";

import Joi from "joi";

import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";
import { ReleaseMetadata, ReleaseCollectionItemMetadata } from "./../../types";
import { Release } from "./Release";
import { ReleaseCollectionItem } from "./ReleaseCollectionItem";
import {
  SORT_COLUMNS,
  PER_PAGE_NUMS,
  SORT_ORDER,
} from "../../utility/constants";
import { ReadAllByPages } from "./../../types";
import { HttpError } from "./../../utility/http-errors/HttpError";

/*
export async function create(metadata: ReleaseMetadata) {
  const pool = await connectDB();

  const release = new Release(metadata);

  try {
    const createReleaseQuery = {
      text:
        "WITH \
          input_rows (tyear_id, label_id, cat_no, name, cover_path) AS ( \
            VALUES ($1::integer, $2::integer, $3, $4, $5) \
          ), \
          \
          ins AS ( \
            INSERT INTO release (tyear_id, label_id, cat_no, name, cover_path) \
            SELECT tyear_id, label_id, cat_no, name, cover_path \
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
        release.year,
        release.label,
        release.catNo,
        release.title,
        release.coverPath,
      ],
    };
    const metadata = (await pool.query(createReleaseQuery)).rows[0];
    const newRelease = new Release(metadata);
    return newRelease;
  } catch (err) {
    logger.error(`Can't create release: ${err.stack}`);
    throw err;
  }
}
*/
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

const schemareadAllByPages = Joi.object({
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

export async function readAll(params: unknown) {
  let {
    sortBy = SORT_COLUMNS[0],
    sortOrder = SORT_ORDER[0],
    pagination: { page = 1, itemsPerPage = PER_PAGE_NUMS[0] },
  } = await schemareadAllByPages.validateAsync(params);

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
    logger.debug(rows[0].releases);
    if (rows.length === 0) throw new HttpError(404);
    const releases: ReleaseCollectionItem[] = rows[0].releases.map(
      (row: ReleaseCollectionItemMetadata) => new ReleaseCollectionItem(row),
    );

    const total_pages = Math.ceil(rows[0].total_count / itemsPerPage);
    const previous_page = page > 1 ? `/releases?page=${page - 1}` : null;
    const next_page = total_pages > page ? `/releases?page=${page + 1}` : null;
    const last_page = `/releases?page=${total_pages}`;

    return {
      page_number: page,
      total_pages,
      total_count: rows[0].total_count,
      previous_page,
      next_page,
      last_page,
      results: releases,
    };
  } catch (err) {
    logger.error(`Can't read releases names: ${err.stack}`);
    throw err;
  }
}

interface Update {
  yearId: number;
  labelId: number;
  catNo: string;
  name: string;
  coverPath: string;
}
/*
export async function update(release: Update) {
  const pool = await connectDB();

  try {
    const updateReleaseQuery = {
      text:
        "UPDATE release \
        SET tyear_id = $1::integer, \
            label_id = $2::integer, \
            cat_no = $3, \
            cover_path = $4, \
            title = $5, \
        WHERE release_id = $6 RETURNING *;",
      values: [
        release.yearId,
        release.labelId,
        release.catNo,
        release.coverPath,
        release.name,
      ],
    };

    const updatedRelease = (await pool.query(updateReleaseQuery)).rows[0];
    return { updatedRelease };
  } catch (err) {
    logger.error(`Can't read label names: ${err.stack}`);
    throw err;
  }
}
*/
/*
async function update(id: number) {
  try {
    const updateYearQuery = {
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
        SELECT tyear_id \
        FROM ins \
        \
        UNION ALL \
        \
        SELECT t.tyear_id \
        FROM input_rows \
        JOIN tyear AS t \
        USING (tyear);",
      values: [track.year],
    };
    const { tyear_id } = (await client.query(updateYearQuery)).rows[0];

    /*
    const updateLabelQuery = {
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
        SELECT label_id FROM ins \
        \
        UNION ALL \
        \
        SELECT l.label_id \
        FROM input_rows \
        JOIN label AS l \
        USING (name);",
      values: [track.label],
    };
    
    //const { label_id } = (await client.query(updateLabelQuery)).rows[0];

  } catch (err) {}
}
*/

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
