const path = require("path");

const BUILD_DIR = path.resolve(__dirname, "./build");
const APP_DIR = path.resolve(__dirname, "./src");

const configDirs = { BUILD_DIR, APP_DIR };

function buildConfig(env) {
  if (env === "development" || env === "production") {
    return require(`./config/${env}.js`)(configDirs);
  } else {
    console.log("Wrong Webpack build parameter. Possible choices: 'development' or 'production'");
  }
}

module.exports = buildConfig;
