const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function update() {
  const metadata = {
    filePath: "./test/new_fil555dda.flac",
    extension: "flac",
    artist: ["Aya", "DJ Unknown", "Alphonse"],
    duration: 25.586,
    bitrate: 256,
    trackNo: 2,
    title: "This is the title!",
    diskNo: 2,
    genre: ["House", "Hardcore"],
  };

  const res = await request
    .put(reqURL("/api/tracks/38"))
    .send(metadata)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  return res.body;
}

update()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
