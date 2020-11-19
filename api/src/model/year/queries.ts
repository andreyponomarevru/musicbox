import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function readAll(): Promise<{ years: object[] }> {
  const pool = await connectDB();
  try {
    const readYearsQuery = {
      text:
        'SELECT tyear.tyear_id AS "yearId", \
                tyear.tyear AS "year" \
         FROM tyear \
         ORDER BY tyear \
         DESC;',
    };
    const years = (await pool.query(readYearsQuery)).rows;
    return { years };
  } catch (err) {
    logger.error(`Can't read artists names: ${err.stack}`);
    throw err;
  }
}
