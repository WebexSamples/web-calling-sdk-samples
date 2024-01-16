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
    // Environment Plugin doesn't override already defined Environment Variables (i.e. DotENV)
    new EnvironmentPlugin({
      WEBEX_LOG_LEVEL: "log",
      DEBUG: "",
      // The following environment variables are specific to our continuous
      // integration process and should not be used in general
      ATLAS_SERVICE_URL: "https://atlas-intb.ciscospark.com/admin/api/v1",
      CONVERSATION_SERVICE:
        "https://conversation-intb.ciscospark.com/conversation/api/v1",
      ENCRYPTION_SERVICE_URL:
        "https://encryption-intb.ciscospark.com/encryption/api/v1",
      HYDRA_SERVICE_URL: "https://apialpha.ciscospark.com/v1/",
      IDBROKER_BASE_URL: "https://idbrokerbts.webex.com",
      IDENTITY_BASE_URL: "https://identitybts.webex.com",
      U2C_SERVICE_URL: "https://u2c-intb.ciscospark.com/u2c/api/v1",
      WDM_SERVICE_URL: "https://wdm-intb.ciscospark.com/wdm/api/v1",
      WHISTLER_API_SERVICE_URL:
        "https://whistler.allnint.ciscospark.com/api/v1",
      WEBEX_CONVERSATION_DEFAULT_CLUSTER:
        "urn:TEAM:us-east-1_int13:identityLookup",
    }),
  ],
};
