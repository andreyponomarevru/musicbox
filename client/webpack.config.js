const path = require("path");
const webpack = require("webpack");
require('dotenv').config({ path: __dirname + "/client.env" });

const { API_URL, PORT, NODE_ENV } = process.env;

console.log(API_URL, PORT, NODE_ENV);

module.exports = {
  entry: "./src/index.js",
  mode: NODE_ENV,
  watch: true,
  module: {
    rules: [
      {
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
      },

      {
        test: /\.scss$/,
        loaders: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
          require.resolve("sass-loader")
        ]
      },

      {
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
      },

      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },

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
