const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./webpack.dev.js");
const router = require("./server/routes/index.js");
const connectDB = require("./server/db.js");

const app = express();
const port = process.env.PORT || 443;
const isDevelopment = process.env.NODE_ENV !== "production";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, './client/build')));
if (isDevelopment) {
  const compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    })
  );
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(express.static(path.join(__dirname, './client/build')));
}

require('dotenv').config();

app.use("/api", router);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

connectDB().then((db) => {
  app.locals.db = db;
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
