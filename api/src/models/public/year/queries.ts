import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";

interface ReadAllYearsDBResponse {
  tyear_id: number;
  year: number;
}

type Years = {
  id: number;
  year: number;
};

export async function readAll(): Promise<Years[]> {
  const pool = await connectDB();
  try {
    const readYearsQuery = {
      text: '\
				SELECT \
					tyear.tyear_id, \
          tyear.tyear AS "year" \
				FROM \
				 	tyear \
				ORDER BY \
					tyear \
				DESC;',
    };
    const response = await pool.query<ReadAllYearsDBResponse>(readYearsQuery);

    if (response.rowCount > 0) {
      return response.rows.map(({ tyear_id, year }) => {
        return { id: tyear_id, year };
      });
    } else {
      return [];
    }
  } catch (err) {
    logger.error(`Can't read artists names: ${err.stack}`);
    throw err;
  }
}
