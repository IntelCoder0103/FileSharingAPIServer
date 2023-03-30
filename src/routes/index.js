const express = require("express");
const router = express.Router();
const fileRouter = require("./FilesRoute");

router.use("/files", fileRouter);

module.exports = router;
