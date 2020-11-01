import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function readAll<T>(): Promise<{ labels: T[] }> {
  const pool = await connectDB();
  try {
    const readLabelsText = "SELECT * FROM label WHERE name IS NOT null";
    const labels = (await pool.query(readLabelsText)).rows;
    return { labels };
  } catch (err) {
    logger.error(`Can't read label names: ${err.stack}`);
    throw err;
  }
}
