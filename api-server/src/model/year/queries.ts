import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function readAll<T>(): Promise<{ years: T[] }> {
  const pool = await connectDB();
  try {
    const readYearsText = "SELECT * FROM tyear WHERE tyear IS NOT null";
    const years = (await pool.query(readYearsText)).rows;
    return { years };
  } catch (err) {
    logger.error(`Can't read artists names: ${err.stack}`);
    throw err;
  }
}
