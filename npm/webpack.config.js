const webpack = require("webpack");
const { EnvironmentPlugin } = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",

  entry: "./src/index.js", // Specify the entry point
  output: {
    filename: "main.js", // Specify the output bundle filename
    path: path.resolve(__dirname, "./src/dist"), // Specify the output directory
  },
  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url"),
      assert: require.resolve("assert"),
      fs: false,
      querystring: require.resolve("querystring-es3"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};
