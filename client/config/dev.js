const webpack = require("webpack");

function buildConfig(configDirs) {
  const devConfig = Object.assign({}, require("./common")(configDirs));
  
  console.log('\x1b[36m%s\x1b[0m', 'Building for development...');
  
  return devConfig;
}

module.exports = buildConfig;
