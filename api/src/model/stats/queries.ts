import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function readLibStats(): Promise<{
  stats: {
    [key: string]: string;
  };
}> {
  const pool = await connectDB();
  try {
    const readLibStatisticTextQuery = { text: "SELECT * FROM view_stats" };
    const { rows } = await pool.query(readLibStatisticTextQuery);
    return { stats: rows[0] };
  } catch (err) {
    logger.error(`Can't read library stats: ${err.stack}`);
    throw err;
  }
}
