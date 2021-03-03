const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function create() {
  const metadata = {
    year: 0,
    label: "TEST label",
    catNo: "0000T--",
    artist: "TestReleseArtist",
    title: "TestReleaseTitle",
  };

  const res = await request
    .post(reqURL("/api/releases"))
    .attach("releaseCover", "./img-0.jpg")
    .field("metadata", JSON.stringify(metadata))
    .set("content-type", "multipart/form-data")
    .set("accept", "application/json");

  return res.body;
}

create().then(console.dir).catch(console.error);
