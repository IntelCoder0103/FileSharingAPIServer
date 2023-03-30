const { v4: uuid } = require("uuid");
const { FilesService } = require("../services");
const path = require('path');
const FileKeyService = require("../services");

const FILE_FOLDER = process.env.FOLDER || "uploads";

class FilesController {
  createFile = async (req, res) => {
    const { file } = req;
    console.log(file.mimetype, file.name, file.originalName, file);
    

    const keys = FilesService.createFile(file);

    res.status(201).send(keys);
  };
  readFile = async (req, res) => {
    const { publicKey } = req.params;
    try {
      const { filename, originalname, mimetype } = FilesService.getFile(publicKey);

      // set the content type header to force a download
      res.setHeader("Content-Type", mimetype);

      // set the content-disposition header to specify the filename
      res.setHeader("Content-Disposition", `attachment; filename=${originalname}`);

      const filePath = path.resolve(`./${FILE_FOLDER}/${filename}`);
      // send the file to the client
      res.sendFile(filePath);
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  };
  deleteFile = async (req, res) => {
    const { privateKey } = req.params;
    try {
      await FilesService.deleteFile(privateKey);
      res.status(200).send();
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  };
}

module.exports = new FilesController();
