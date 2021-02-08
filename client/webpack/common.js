const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// load env vars specified in docker-compose.yml into process.env
const dotenv = require("dotenv").config();
const { REACT_APP_API_ROOT, PORT, NODE_ENV } = process.env;

console.log(REACT_APP_API_ROOT, PORT, NODE_ENV);

//
// Loaders
//

const awesomeTypeScriptLoader = {
  test: /\.(ts|tsx)$/,
  loader: "awesome-typescript-loader",
};

const sourceMapLoader = {
  enforce: "pre",
  test: /\.js$/,
  loader: "source-map-loader",
};

const scssLoader = {
  test: /\.scss$/,
  loaders: [
    require.resolve("style-loader"),
    require.resolve("css-loader"),
    require.resolve("sass-loader"),
  ],
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
        },
      },
    },
  ],
};

const fontLoader = {
  test: /\.(woff|woff2|eot|ttf)$/,
  use: [
    {
      loader: "file-loader",
    },
  ],
};

//
// Plugins
//

const injectEnvVarsIntoReactPlugin = new webpack.DefinePlugin({
  "process.env": {
    REACT_APP_API_ROOT: `"${REACT_APP_API_ROOT}"`,
  },
});

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, "./../public", "index.html"),
});

//
// Webpack Configuration
//

function buildConfig(configDirs) {
  return {
    entry: `${configDirs.APP_DIR}/index.tsx`,
    mode: NODE_ENV,
    watch: true,
    module: {
      rules: [
        awesomeTypeScriptLoader,
        sourceMapLoader,
        scssLoader,
        imageLoader,
        fontLoader,
      ],
    },
    plugins: [injectEnvVarsIntoReactPlugin, htmlWebpackPlugin],
    output: {
      path: configDirs.BUILD_DIR,
      publicPath: "/dist/",
      filename: "bundle.js",
      sourceMapFilename: "bundle.js.map",
    },
    resolve: {
      extensions: ["*", ".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    devServer: {
      disableHostCheck: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      // https://webpack.js.org/configuration/dev-server/#devservercontentbase
      contentBase: [
        path.join(__dirname, "../public/"),
        path.join(__dirname, "../src/"),
      ],
      port: PORT,
      publicPath: `http://localhost:${PORT}/dist/`,
      host: "0.0.0.0",
    },
    devtool: "source-map",
  };
}

module.exports = buildConfig;
