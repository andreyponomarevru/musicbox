const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function isFilePathExists() {
  const data = {
    path: "./test/path.mp2",
  };

  const res = await request
    .post(reqURL("/api/constraints/file-path"))
    .send(data)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  return res.body;
}

isFilePathExists()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
