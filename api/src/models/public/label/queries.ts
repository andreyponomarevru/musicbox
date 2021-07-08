import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";

type ReadAllLabelsDBResponse = {
  label_id: number;
  name: string;
};

type Label = {
  labelId: number;
  name: string;
};

export async function readAll(): Promise<Label[]> {
  const pool = await connectDB();
  try {
    const readAllLabelsQuery = {
      text: "\
				SELECT \
					label_id, \
					name \
				FROM \
				  label \
				ORDER BY \
					name ASC;\
			",
    };
    const response = await pool.query<ReadAllLabelsDBResponse>(
      readAllLabelsQuery,
    );
    if (response.rowCount > 0) {
      return response.rows.map(({ label_id, name }) => {
        return { labelId: label_id, name };
      });
    } else {
      return [];
    }
  } catch (err) {
    logger.error(`Can't read label names: ${err.stack}`);
    throw err;
  }
}
