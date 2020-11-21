import { logger } from "../../config/loggerConf";
import { connectDB } from "../postgres";

type LibStats = {
  stats: {
    [key: string]: string;
  };
};

export async function readLibStats(): Promise<LibStats> {
  const pool = await connectDB();
  try {
    const readLibStatsTextQuery = { text: "SELECT * FROM view_stats;" };
    const { rows } = await pool.query(readLibStatsTextQuery);
    console.log(rows[0]);
    return { stats: rows[0] };
  } catch (err) {
    logger.error(`Can't read library stats: ${err.stack}`);
    throw err;
  }
}

export async function readGenreStats() {
  const pool = await connectDB();
  try {
    const readGenreStats = { text: "SELECT * FROM view_genre_stats;" };
    const { rows } = await pool.query(readGenreStats);
    return { stats: rows };
  } catch (err) {
    logger.error(`Can't read genre stats: ${err.stack}`);
    throw err;
  }
}

export async function readYearStats() {
  const pool = await connectDB();
  try {
    const readYearStats = { text: "SELECT * FROM view_year_stats;" };
    const { rows } = await pool.query(readYearStats);
    return { stats: rows };
  } catch (err) {
    logger.error(`Can't read year stats: ${err.stack}`);
    throw err;
  }
}

export async function readArtistStats() {
  const pool = await connectDB();
  try {
    const readArtistStats = { text: "SELECT * FROM view_artist_stats;" };
    const { rows } = await pool.query(readArtistStats);
    return { stats: rows };
  } catch (err) {
    logger.error(`Can't read artist stats: ${err.stack}`);
    throw err;
  }
}

export async function readLabelStats() {
  const pool = await connectDB();
  try {
    const readLabelStats = { text: "SELECT * FROM view_label_stats;" };
    const { rows } = await pool.query(readLabelStats);
    return { stats: rows };
  } catch (err) {
    logger.error(`Can't read label stats: ${err.stack}`);
    throw err;
  }
}
