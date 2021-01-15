const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function create() {
  const metadata = {
    filePath: null,
    coverPath: "cover/pathhhhh!!",
    extension: "flac",
    trackArtist: ["Aya"],
    releaseArtist: "Aya",
    duration: 25.586,
    bitrate: 256,
    year: 2500,
    trackNo: 25,
    trackTitle: "This is the title!",
    releaseTitle: "Unknown albim ;)",
    diskNo: null,
    label: "WWW",
    genre: ["House"],
    catNo: "MN-58",
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
