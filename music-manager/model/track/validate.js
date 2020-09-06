const Validator = require("./../../utility/Validator.js");

async function validate(data) {
  const schema = Validator.setSchema({
    filePath: Validator.isStr().isLength(1, 255),
    //year: Validator.isYear(),
    //extension: Validator.isLength(1, 100).isSupportedValue(
    //  process.env.SUPPORTED_CODEC,
    //),
    //artist: Validator.isStr().isLength(0, 100),
    //duration: Validator.isFloat(),
    //bitrate: Validator.isFloat(),
    //trackNo: Validator.isTrackNo(),
    //title: Validator.isStr().isLength(0, 100),
    //album: Validator.isStr().isLength(0, 100),
    //diskNo: Validator.isDiskNo(),
    //label: Validator.isStr().isLength(0, 100),
    //genre: Validator.isArr().items(Validator.isStr()),
  });

  const validated = await schema.validate({
    filePath: data.filePath,
    year: data.common.year,
    extension: data.format.codec,
    artist: data.common.artist,
    duration: data.format.duration,
    bitrate: data.format.bitrate,
    trackNo: data.common.track.no,
    title: data.common.title,
    album: data.common.album,
    diskNo: data.common.disk.no,
    label: data.common.copyright,
    genre: data.common.genre,
  });

  for (let { error, value } in validated) {
    if (error) {
      const err = {
        location: data.common.filePath,
        msg: `${value} in invalid`,
        param: error,
      };
      throw new Error(err);
    }
  }

  return validated;
}

module.exports = validate;
