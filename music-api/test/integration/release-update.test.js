const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function update() {
  const metadata = {
    year: 2022,
    label: "TEST label UPDATED!!!",
    catNo: "0000T+",
    artist: "Test Relese Artist UPDATED!",
    title: "Test Release Title UPDATED",
  };

  const res = await request
    .put(reqURL("/api/releases/38"))
    .attach("releaseCover", "./img-1.jpg")
    .field("metadata", JSON.stringify(metadata))
    .set("content-type", "multipart/form-data")
    .set("accept", "application/json");

  return res.body;
}

update().then(console.dir).catch(console.error);
