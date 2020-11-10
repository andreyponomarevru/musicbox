import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function readAll(): Promise<{ labels: object[] }> {
  const pool = await connectDB();
  try {
    const readLabelsQuery = {
      text:
        "SELECT label_id, name \
         FROM label \
         ORDER BY name ASC;",
    };
    const labels = (await pool.query(readLabelsQuery)).rows;
    return { labels };
  } catch (err) {
    logger.error(`Can't read label names: ${err.stack}`);
    throw err;
  }
}
