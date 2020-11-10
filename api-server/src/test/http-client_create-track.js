const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function create() {
  const metadata = {
    filePath: "./test/path.mp44!",
    picturePath: "picture/pathhhhh!!",
    extension: "flac",
    artist: ["Aya"],
    duration: 25.586,
    bitrate: 256,
    year: 2500,
    trackNo: 25,
    title: "This is the title!",
    album: "Unknown albim ;)",
    diskNo: null,
    label: "WWW",
    genre: ["House"],
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
