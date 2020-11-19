import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

export async function coverPathExists(
  coverPath: string,
): Promise<{ exists: boolean }> {
  const pool = await connectDB();
  try {
    const query = {
      text: "SELECT * FROM track WHERE cover_path = $1",
      values: [coverPath],
    };

    if ((await pool.query(query)).rows.length > 0) return { exists: true };
    else return { exists: false };
  } catch (err) {
    logger.error(`Error during 'isPicturePathUnique' execution: ${err.stack}`);
    throw err;
  }
}

export async function filePathExists(
  filePath: string,
): Promise<{ exists: boolean }> {
  const pool = await connectDB();
  try {
    const query = {
      text: "SELECT * FROM track WHERE file_path = $1",
      values: [filePath],
    };

    if ((await pool.query(query)).rows.length > 0) return { exists: true };
    else return { exists: false };
  } catch (err) {
    logger.error(`Error during 'isFilePathUnique' execution: ${err.stack}`);
    throw err;
  }
}
