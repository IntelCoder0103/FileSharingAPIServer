const fs = require('fs');
const path = require('path');
const FileKeyService = require('./FileKeyService');

const FILE_FOLDER = process.env.FOLDER || "uploads";

class FilesService{

  createFile = (file) => {
    const keys = FileKeyService.generateFileKeys(file);
    return keys;
  };

  getFile = (publicKey) => {
    const keyData = FileKeyService.decryptPublicKey(publicKey);
    return keyData;
  };

  deleteFile = async (privateKey) => {
    const {filename} = FileKeyService.decryptPrivateKey(privateKey);
    const filePath = path.resolve(`./${FILE_FOLDER}/${filename}`);
    try {
      await fs.promises.unlink(filePath);
    } catch (e) {
      throw new Error("Delete File Error");
    }
  };
}
const serviceInstance = new FilesService();
module.exports = serviceInstance;
