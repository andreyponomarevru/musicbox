const request = require("superagent");

function reqURL(path) {
  const requrl = new URL("http://musicbox.com:8000");
  requrl.pathname = path;
  console.log(requrl.toString());
  return requrl.toString();
}

async function isPicturePathExists() {
  const data = {
    path: "cover/pathhd",
  };

  const res = await request
    .post(reqURL("/api/constraints/cover-path"))
    .send(data)
    .set("content-type", "application/json")
    .set("accept", "application/json");

  return res.body;
}

isPicturePathExists()
  .then((r) => console.dir(r))
  .catch((err) => console.error(err));
