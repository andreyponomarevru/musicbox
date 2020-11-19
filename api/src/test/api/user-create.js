const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function create() {
  const metadata = {
    name: "andrey",
    settings: {
      isLibLoaded: true,
    },
  };

  const res = await request
    .post(reqURL("/api/users"))
    .send(metadata)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  return res.body;
}

create()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
