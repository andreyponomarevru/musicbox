import { logger } from "../../../config/loggerConf";
import { connectDB } from "../../postgres";

export async function create(userId: number, settings: object) {
  const pool = await connectDB();
  console.log(userId, settings);
  try {
    const createUserSettingsQuery = {
      text:
        'UPDATE appuser \
         SET settings = $1 \
         WHERE appuser_id = $2 \
         RETURNING appuser_id AS "userId", settings;',
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
      text:
        'SELECT appuser_id AS "userId", settings \
         FROM appuser \
         WHERE appuser_id = $1',
      values: [id],
    };

    const retrievedSettings = (await pool.query(readUserSettingsQuery)).rows[0];
    return {
      userId: retrievedSettings.userId,
      settings: retrievedSettings.settings,
    };
  } catch (err) {
    logger.error(
      `An error occured while reading settings from database:\n${err.stack}`,
    );
    throw err;
  }
}

export async function update(id: number, newSettings: object) {
  const pool = await connectDB();

  try {
    const readUserSettingsQuery = {
      text:
        'UPDATE appuser \
         SET settings = $1 \
         WHERE appuser_id = $2 \
         RETURNING appuser_id AS "userId", name;',
      values: [newSettings, id],
    };

    const updatedSettings = (await pool.query(readUserSettingsQuery)).rows[0];
    return {
      userId: updatedSettings.userId,
      settings: updatedSettings.settings,
    };
  } catch (err) {
    logger.error(
      `An error occured while reading settings from database:\n${err.stack}`,
    );
    throw err;
  }
}
