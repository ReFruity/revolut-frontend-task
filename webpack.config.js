const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",

  output: {
    filename: "bundle.min.js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.ejs",
      title: "Showcase",
    }),
  ],

  module: {
    rules: [
      {
        exclude: /node_modules/,
        include: [path.resolve(__dirname, "src")],
        loader: "ts-loader",
        test: /.(ts|tsx)?$/,
      },
      { test: /\.ejs$/, loader: "ejs-loader" },
    ],
  },

  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
    extensions: [".ts", ".tsx", ".js"],
  },
};
