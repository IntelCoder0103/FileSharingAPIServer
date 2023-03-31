const fs = require('fs');
const path = require('path');
const FileKeyService = require('./FileKeyService');

const { FILE_FOLDER } = require("../config");


class LocalStorageService{

  uploadFile = async (file) => {
    const filePath = path.resolve(`./${FILE_FOLDER}/${file.filename}`);
    await fs.promises.writeFile(filePath, file.buffer);
  }

  downloadStream = async (filename) => { 
    const filePath = path.resolve(`./${FILE_FOLDER}/${filename}`);
    const stream = fs.createReadStream(filePath);
    return stream;
  }
  
  deleteFile = async (filename) => {
    const filePath = path.resolve(`./${FILE_FOLDER}/${filename}`);
    try {
      await fs.promises.unlink(filePath);
    } catch (e) {
      throw new Error("Delete File Error");
    }
  };
}

const serviceInstance = new LocalStorageService();
module.exports = serviceInstance;
