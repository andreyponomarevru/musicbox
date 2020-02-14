const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  watch: true,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },

      /* Original React settings for css:
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      */

      {
        // CSS (SASS) LOADER
        test: /\.scss$/,
        loaders: [
          require.resolve("style-loader"),
          require.resolve("css-loader"),
          require.resolve("sass-loader")
        ]
      },

      {
        // IMAGE LOADER
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
        // FONT LOADER
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
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true
  }
};
