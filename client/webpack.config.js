const path = require("path");
const webpack = require("webpack");
const dotenv = require('dotenv').config({ path: __dirname + "/client.env" });
const { API_URL, PORT, NODE_ENV } = process.env;

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
      // "react-hot-loader/babel",
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

const dotenvPlugin = new webpack.DefinePlugin({
  "process.env": dotenv.parsed
});

//
// Webpack Configuration
//

module.exports = {
  entry: "./src/index.js",
  mode: NODE_ENV,
  watch: true,
  module: { rules: [ jsLoader, scssLoader, imageLoader, fontLoader ] },
  plugins: [ dotenvPlugin ],
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
    filename: "bundle.js",
    sourceMapFilename: "bundle.js.map"
  },
  devServer: {
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    contentBase: path.join(__dirname, "public/"),
    port: PORT,
    publicPath: `http://localhost:${PORT}/dist/`,
    // hotOnly: true,
    host: '0.0.0.0', 
  },
  devtool: "source-map"
};
