import util from "util";

import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";
import { User } from "./../../../types";

type NewUser = { userId: number; name: string };
type Exists = { exists: boolean };

//

export async function read(userId: number): Promise<User> {
  const pool = await connectDB();

  try {
    const readUserQuery = {
      text: "SELECT * FROM appuser WHERE appuser_id = $1;",
      values: [userId],
    };

    const res = await pool.query(readUserQuery);
    const user: User = res.rows[0];

    logger.info(`User retrieved successfully: ${util.inspect(user)}`);

    return user;
  } catch (err) {
    const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
    const msg = `An error occurred while reading a user in the db.\n${errStack}`;
    logger.error(msg);
    throw err;
  }
}

export async function create(username: string): Promise<NewUser> {
  const pool = await connectDB();

  try {
    const createUserQuery = {
      text: 'INSERT INTO appuser (name) \
         VALUES ($1) \
         RETURNING appuser_id AS "userId", name;',
      values: [username],
    };

    const res = await pool.query(createUserQuery);
    const user: NewUser = {
      userId: res.rows[0].userId,
      name: res.rows[0].name,
    };

    logger.info(`User successfully created: ${util.inspect(user)}`);

    return user;
  } catch (err) {
    const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
    const msg = `An error occurred while adding a user to the db.\n${errStack}`;
    logger.error(msg);
    throw err;
  }
}

export async function exists(id: number): Promise<Exists> {
  const pool = await connectDB();

  try {
    const userExistsQuery = {
      text: "\
				SELECT EXISTS (\
					SELECT \
						1 \
					FROM \
						appuser \
					WHERE \
						appuser_id = $1\
				);",
      values: [id],
    };

    const res = await pool.query(userExistsQuery);
    const exists: Exists = res.rows[0];

    logger.info(
      `User with id ${id} already exists in database: ${util.inspect(exists)}`,
    );

    return exists;
  } catch (err) {
    const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
    const msg = `An error occurred while checking the existence of a user in the db.\n${errStack}`;
    logger.error(msg);
    throw err;
  }
}

/*
export async function destroy(id: number) {
  const pool = await connectDB();

  try {
    const deleteTrackQuery = {
      text: "DELETE FROM appuser WHERE appuser_id = $1 RETURNING name",
      values: [id],
    };
    type Name = { name: string };
    const { name }: Name = (await pool.query(deleteTrackQuery)).rows[0];

    logger.info(`User with id ${id} successfully deleted from db`);

    return { name };
  } catch (err) {
    const errStack = process.env.NODE_ENV === "development" ? err.stack : "";
    const msg = `filePath: ${__filename}: An error occurred while deleting a user from the db\n${errStack}`;
    logger.error(msg);
    throw err;
  }
}
*/
