import { logger } from "../../../config/logger";
import { connectDB } from "../../postgres";

import {
  MatchingArtists,
  MatchingLabels,
  MatchingReleases,
  TrackExtendedMeta,
} from "../../../types";

// Search only in release and track titles

export async function find(text: string) {
  // TODO: function is only galf implemennted. Finish it using https://stackoverflow.com/questions/23320945/postgresql-select-if-string-contains — OR better read this file:///mnt/9904b8b1-2f58-4bc1-a5de-aa1584088b5e/programming-sandbox/text/db/relational/postgresql-and-sql/keywords-and-operators.md#in-condition - LIKE qualifier is what you need to do pattern matching. If you encounter problems with quotes or ano other, here are splution: https://stackoverflow.com/questions/23320945/postgresql-select-if-string-contains
  // Generally you need to search NAME field in ARTIST table for a substring (user unput). Example: 'Ay' should return artists "Aya", "Lisa May"

  const textString = String(text).toLowerCase();
  const pool = await connectDB();

  try {
    const getArtist = {
      text: 'SELECT artist_id AS "artistId", name FROM artist WHERE name=$1',
      values: [textString],
    };
    const trackMetadata: MatchingArtists = (await pool.query(getArtist)).rows;
    console.log(trackMetadata);
    return trackMetadata;
  } catch (err) {
    logger.error(`${__filename}: Error while reading a track.`);
    throw err;
  }
}
