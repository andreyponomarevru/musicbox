import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

type ReturnStatistic = Promise<{
  stats: {
    [key: string]: string;
  };
}>;

export async function readLibStatistic(): ReturnStatistic {
  const pool = await connectDB();
  try {
    const readLibStatisticTextQuery = { text: "SELECT * FROM view_statistics" };
    const { rows } = await pool.query(readLibStatisticTextQuery);
    return { stats: rows[0] };
  } catch (err) {
    logger.error(`Can't read library statistic: ${err.stack}`);
    throw err;
  }
}
