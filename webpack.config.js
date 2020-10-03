const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodeEnvPlugin = require("node-env-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "production",
  entry: {
    app: "./src/index.js",
    utility: "./src/utility.js",
  },
  devtool: "inline-source-map",
  devtool: NodeEnvPlugin.devtool,
  devServer: {
    open: true,
    contentBase: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv({}),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
