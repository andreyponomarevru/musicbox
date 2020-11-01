/*
const logger = require("./../utility/loggerConf.js");
const db = require("./../model/track/postgres.js");
const getMetadata = require("./../index.js");
const getSanitizedMetadata = require("./../index.js");

async function update(id, nodePath) {
  const metadata = await getMetadata(nodePath);
  const sanitized = getSanitizedMetadata(metadata);
  sanitized.filePath = "test";
  //await db.create(sanitized);
  console.log(sanitized);
  return db.update(id, sanitized);
}

update(
  1,
  "/music/Al Johnson - Back For More/03. Kylie Minogue - Chocolate (Tom Middleton Cosmos Mix).flac",
)
  .then(logger.info)
  .then(() => {
    logger.debug("At this point, file watcher should be enbaled");
    
    //watcher
    //  .on("add", onAddHandler)
    //  .on("change", onChangeHandler)
    //  .on("unlink", onUnlinkHandler)
    //  .on("error", onErrorHandler);
   
  })
  .catch((err) => {
    logger.error(`${__filename}: ${err}`);
  });
  */
