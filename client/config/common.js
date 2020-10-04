const path = require("path");
const webpack = require("webpack");

// load env vars specified in docker-compose.yml into process.env
const dotenv = require('dotenv').config();
const { REACT_APP_API_URL, PORT, NODE_ENV } = process.env;

console.log(REACT_APP_API_URL, PORT, NODE_ENV);

//
// Loaders
//

const jsLoader = {
  test: /\.(js|jsx)$/,
  exclude: /(node_modules|bower_components)/,
  loader: "babel-loader",
  options: {
    presets: ["@babel/env", "@babel/preset-react"],
    plugins: [
      "react-hot-loader/babel",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-private-methods"
    ]
  }
};

const scssLoader = {
  test: /\.scss$/,
  loaders: [
    require.resolve("style-loader"),
    require.resolve("css-loader"),
    require.resolve("sass-loader")
  ]
};

const imageLoader = {
  test: /\.(jpe?g|png|gif|ico|svg)$/,
  use: [
    {
      loader: "file-loader",
      options: {
        name: "[name].[ext]",
        context: "src",

        outputPath: (url, resourcePath, context) => {
          return `img/${url}`;
        }
      }
    }
  ]
};

const fontLoader = {
  test: /\.(woff|woff2|eot|ttf)$/,
  use: [
    {
      loader: "file-loader"
    }
  ]
};

//
// Plugins
//

const injectEnvVarsIntoReactPlugin = new webpack.DefinePlugin({
  "process.env": {
    "REACT_APP_API_URL": `"${REACT_APP_API_URL}"`
  }
});


//
// Webpack Configuration
//

function buildConfig(configDirs) {
  return {
    entry: `${configDirs.APP_DIR}/index.js`,
    mode: NODE_ENV,
    watch: true,
    module: { rules: [ jsLoader, scssLoader, imageLoader, fontLoader ] },
    plugins: [ injectEnvVarsIntoReactPlugin ],
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
      path: configDirs.BUILD_DIR,
      publicPath: "/dist/",
      filename: "bundle.js",
      sourceMapFilename: "bundle.js.map"
    },
    devServer: {
      disableHostCheck: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      contentBase: path.join(__dirname, "../public/"),
      port: PORT,
      publicPath: `http://localhost:${PORT}/dist/`,
      host: '0.0.0.0', 
    },
    devtool: "source-map"
  };
}

module.exports = buildConfig;
