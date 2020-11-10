const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function create() {
  const metadata = {
    filePath: "./test/new_file.flac",
    picturePath: "cover/cover2.jpeg",
    extension: "flac",
    artist: ["Aya", "DJ Unknown", "Alphonse"],
    duration: 25.586,
    bitrate: 256,
    year: 2018,
    trackNo: 2,
    title: "This is the title!",
    album: "Unknown Album - CD, Reissue",
    diskNo: 2,
    label: "Hed Kandi",
    genre: ["House", "Funk"],
  };

  const res = await request
    .put(reqURL("/api/tracks/1"))
    .send(metadata)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  return res.body;
}

create()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
