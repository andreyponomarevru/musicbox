const path = require("path");

function getExtensionName(nodePath) {
  const ext = path.extname(nodePath).slice(1);
  return ext;
}

module.exports = getExtensionName;
