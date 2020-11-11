import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

type ReturnCreate = Promise<{ userId: number; name: string }>;

export async function create(username: string): ReturnCreate {
  const pool = await connectDB();

  try {
    const createUserQuery = {
      text:
        'INSERT INTO appuser (name) \
         VALUES ($1) \
         RETURNING appuser_id AS "userId", name;',
      values: [username],
    };
    const newUser = (await pool.query(createUserQuery)).rows[0];
    return { userId: newUser.userId, name: newUser.name };
  } catch (err) {
    const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
    const msg = `An error occurred while adding a user to the database.\n${errStack}`;
    logger.error(msg);
    throw new Error();
  }
}

export async function exists(id: number): Promise<{ exists: boolean }> {
  const pool = await connectDB();

  try {
    const userExistsQuery = {
      text: "SELECT EXISTS (SELECT 1 FROM appuser WHERE appuser_id = $1);",
      values: [id],
    };
    const { exists } = (await pool.query(userExistsQuery)).rows[0];
    return { exists };
  } catch (err) {
    const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
    const msg = `An error occurred while checking the existence of a user in the database.\n${errStack}`;
    logger.error(msg);
    throw new Error();
  }
}

export async function destroy(id: number): Promise<{ name: string }> {
  const pool = await connectDB();

  try {
    const deleteTrackQuery = {
      text: "DELETE FROM appuser WHERE appuser_id = $1 RETURNING name",
      values: [id],
    };
    const deletedUserName = (await pool.query(deleteTrackQuery)).rows[0];
    return { name: deletedUserName.name };
  } catch (err) {
    const text = `filePath: ${__filename}: An error occurred while deleting a user from the database\n${err.stack}`;
    logger.error(text);
    throw err;
  }
}
