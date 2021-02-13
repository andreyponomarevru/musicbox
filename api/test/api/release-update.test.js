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
    catNo: "LEG7RR",
    artist: "Test Relese Artist UPDATED!",
    title: "Test Release Title UPDATED",
    coverPath: "/api/icons/album.svg UPDATED",
  };

  const res = await request
    .put(reqURL("/api/releases/38"))
    .send(metadata)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  console.dir(res);

  return res.body;
}

update()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
