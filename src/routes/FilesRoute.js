const express = require("express");
const filesController = require("../controllers/FilesController");
const router = express.Router();

const { downloadLimiter, uploadLimiter } = require("../middlewares");

router.post("/", uploadLimiter, filesController.createFile);
router.delete("/:privateKey", filesController.deleteFile);
router.get("/:publicKey", downloadLimiter, filesController.readFile);

module.exports = router;
