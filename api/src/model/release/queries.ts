import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";
import { ReleaseMetadata } from "./../../types";
import { Release } from "./Release";
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
      values: [metadata.yearId, label_id, track.catNo, track.release, track.coverPath],
    };
    const r = await pool.query(createReleaseQuery);
  } catch(err) {
    logger.error(`Can't create release: ${err.stack}`);
  }
}
*/
export async function readAll(): Promise<{ releases: Release[] }> {
  const pool = await connectDB();
  try {
    const readReleasesQuery = {
      text: "SELECT * FROM view_release;",
    };
    const { rows } = await pool.query(readReleasesQuery);
    logger.debug(rows);
    const releases = rows.map((row) => new Release(row));
    return { releases };
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
interface ReturnUpdate extends Update {
  releaseId: number;
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

async function update(id) {
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
