import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";
import { UserSettings } from "./../../../types";

export async function create(userId: number, settings: UserSettings) {
  const pool = await connectDB();
  console.log(userId, settings);
  try {
    const createUserSettingsQuery = {
      text: '\
				UPDATE \
					appuser \
				SET \
					settings = $1 \
				WHERE \
					appuser_id = $2 \
				RETURNING \
					appuser_id AS "userId", \
					settings;',
      values: [JSON.stringify(settings), userId],
    };

    const createdSettings = (await pool.query(createUserSettingsQuery)).rows[0];
    return {
      userId: createdSettings.userId,
      settings: createdSettings.settings,
    };
  } catch (err) {
    logger.error(
      `An error occured while creating settings in the database:\n${err.stack}`,
    );
    throw err;
  }
}

export async function read(id: number) {
  const pool = await connectDB();

  try {
    const readUserSettingsQuery = {
      text: "\
				SELECT \
					appuser_id, \
					settings \
				FROM \
					appuser \
				WHERE \
					appuser_id = $1",
      values: [id],
    };

    const response = await pool.query(readUserSettingsQuery);
    const userSettings = response.rows[0];

    return {
      userId: userSettings.appuser_id,
      settings: userSettings.settings,
    };
  } catch (err) {
    logger.error(
      `An error occured while reading settings from database:\n${err.stack}`,
    );
    throw err;
  }
}

export async function update(
  id: number,
  newSettings: UserSettings,
): Promise<{
  userId: number;
  settings: string;
}> {
  const pool = await connectDB();

  try {
    const readUserSettingsQuery = {
      text: "\
				UPDATE \
					appuser \
				SET \
					settings = $1 \
				WHERE \
					appuser_id = $2 \
				RETURNING \
					appuser_id, \
					name;",
      values: [newSettings, id],
    };

    const response = await pool.query(readUserSettingsQuery);

    const updatedSettings = response.rows[0];
    return {
      userId: updatedSettings.appuser_id,
      settings: updatedSettings.settings,
    };
  } catch (err) {
    logger.error(
      `An error occured while reading settings from database:\n${err.stack}`,
    );
    throw err;
  }
}
