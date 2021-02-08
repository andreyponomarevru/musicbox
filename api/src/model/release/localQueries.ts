import util from "util";

import Joi from "joi";

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

/*
 * Queries used only locally (not exposed through the controller), for adding
 * tracks to the database while scanning the local disk i.e. they are not used
 * by public REST API
 */
/*
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
*/
