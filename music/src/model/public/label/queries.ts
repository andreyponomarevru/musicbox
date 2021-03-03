import { logger } from "../../../config/logger-conf";
import { connectDB } from "../../postgres";

export async function readAll() {
  const pool = await connectDB();
  try {
    const readLabelsQuery = {
      text:
        'SELECT label_id AS "labelId", name \
         FROM label \
         ORDER BY name ASC;',
    };
    const labels = (await pool.query(readLabelsQuery)).rows;
    return labels;
  } catch (err) {
    logger.error(`Can't read label names: ${err.stack}`);
    throw err;
  }
}
