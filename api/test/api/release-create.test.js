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
    catNo: "Tl0001",
    artist: "Test Relese Artist",
    title: "Test Release Title",
    // coverPath: path should beconstructed on the server
  };

  const res = await request
    .post(reqURL("/api/releases"))
    .send(metadata)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  return res.body;
}

create()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
