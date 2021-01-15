const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function create() {
  const metadata = {
    catNo: "MN-58",
    label: "Hed Kandi",
    year: 2018,
    coverPath: "cover/cover2.jpeg",
    name: "Unknown Album - CD, Reissue",
  };

  const res = await request
    .put(reqURL("/api/releases/1"))
    .send(metadata)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  return res.body;
}

create()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
