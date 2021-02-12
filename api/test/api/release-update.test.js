const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function update() {
  const metadata = {
    id: 38,
    year: 2022,
    label: "TEST label UPDATED",
    catNo: "CD TOT 55- UPDATED",
    artist: "Test Relese Artist UPDATED!",
    title: "Test Release Title UPDATED",
    coverPath: "/api/icons/album.svg UPDATED",
    /*
    tracks: [
      {
        trackId: 1,

        trackNo: 2,
        diskNo: 1,
        trackArtist: ["Test Track Artist"],
        trackTitle: "Test Track Title",
        genre: ["Genre1", "Genre2"],
        duration: 1111,
        filePath: null,
        extension: "flac",
        bitrate: 320000,
      },
    ],
    */
  };

  const res = await request
    .put(reqURL("/api/releases/1"))
    .send(metadata)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  console.dir(res);

  return res.body;
}

update()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
