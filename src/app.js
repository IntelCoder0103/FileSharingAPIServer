const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const app = express();


const { FILE_FOLDER } = require("./config");

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
// Multer
app.use(upload.single("file"));

app.use(routes);

module.exports = app;