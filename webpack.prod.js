const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

webpackConfig.mode = "production";

module.exports = webpackConfig;
