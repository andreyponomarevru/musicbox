const webpack = require("webpack");

function buildConfig(configDirs) {
  let prodConfig = Object.assign({}, require("./common")(configDirs));

  // prodConfig.plugins.push(new webpack.optimize.UglifyJsPlugin)({ minimize: true }); // just an example, replace by your own plugins
  
  console.log('\x1b[36m%s\x1b[0m', 'Building for production ...');
  
  return prodConfig;
}

module.exports = buildConfig;
