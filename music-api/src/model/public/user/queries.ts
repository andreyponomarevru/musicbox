import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";

export async function create(username: string) {
  const pool = await connectDB();

  try {
    const createUserQuery = {
      text: 'INSERT INTO appuser (name) \
         VALUES ($1) \
         RETURNING appuser_id AS "userId", name;',
      values: [username],
    };
    type NewUser = { userId: number; name: string };
    const newUser: NewUser = (await pool.query(createUserQuery)).rows[0];
    return { userId: newUser.userId, name: newUser.name };
  } catch (err) {
    const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
    const msg = `An error occurred while adding a user to the database.\n${errStack}`;
    logger.error(msg);
    throw new Error();
  }
}

export async function exists(id: number) {
  const pool = await connectDB();

  try {
    const userExistsQuery = {
      text: "SELECT EXISTS (SELECT 1 FROM appuser WHERE appuser_id = $1);",
      values: [id],
    };
    type Exists = { exists: boolean };
    const exists: Exists = (await pool.query(userExistsQuery)).rows[0];
    return exists;
  } catch (err) {
    const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
    const msg = `An error occurred while checking the existence of a user in the database.\n${errStack}`;
    logger.error(msg);
    throw new Error();
  }
}

export async function destroy(id: number) {
  const pool = await connectDB();

  try {
    const deleteTrackQuery = {
      text: "DELETE FROM appuser WHERE appuser_id = $1 RETURNING name",
      values: [id],
    };
    type Name = { name: string };
    const { name }: Name = (await pool.query(deleteTrackQuery)).rows[0];
    return { name };
  } catch (err) {
    const text = `filePath: ${__filename}: An error occurred while deleting a user from the database\n${err.stack}`;
    logger.error(text);
    throw err;
  }
}
