const path = require('path');
const webpack = require("webpack");

module.exports = (env, options) => {
  // console.log(options.mode); // returns string 'development' or 'production'
  return {
    entry: {
      master: './src/index.js',
    },
    devtool: 'inline-source-map',
    mode: "development",
    output: {
      path: path.resolve(__dirname, 'dist/'),
      filename: 'bundle.js',
      publicPath: '/dist/',
    },
    watch: true,
    resolve: { extensions: ["*", ".js", ".jsx"] },

    devServer: {
      contentBase: path.join(__dirname, "public/"),
      overlay: true,
      port: 3000,
      publicPath: "http://localhost:3000/dist/",
      contentBase: './dist',
      hotOnly: true
    },

    module: {
      rules: [
       {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
          options: { presets: ["@babel/env"] }
        },
      
       {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },

  };
};
