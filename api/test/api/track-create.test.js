const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function create() {
  const metadata = {
    releaseId: 40,

    trackNo: 1,
    diskNo: 1,
    artist: ["Test Track Artist 1", "Test Track Artist 2"],
    title: "Test Track Title",
    genre: ["Genre1", "Genre2"],
    duration: 1111,
    filePath: null,
    extension: "flac",
    bitrate: 320000,
  };

  const res = await request
    .post(reqURL("/api/tracks"))
    .send(metadata)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  return res.body;
}

create()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
