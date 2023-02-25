const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

webpackConfig.mode = "development";
webpackConfig.entry = [
  "webpack-hot-middleware/client?reload=true",
  webpackConfig.entry,
];
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = webpackConfig;
