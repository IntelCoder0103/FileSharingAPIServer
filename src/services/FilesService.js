const { v4: uuid } = require('uuid');
const FileKeyService = require("./FileKeyService");
const StorageService = require("./StorageService");
class FilesService {
  createFile = async (file) => {
    const keys = FileKeyService.generateFileKeys(file);
    await StorageService.uploadFile(file);
    return keys;
  };

  getFile = async (publicKey) => {
    const { filename, originalname, mimetype } = FileKeyService.decryptPublicKey(publicKey);
    console.log(filename);
    const stream = await StorageService.downloadStream(filename);
    return {stream, originalname, mimetype};
  };

  deleteFile = async (privateKey) => {
    const { filename } = FileKeyService.decryptPrivateKey(privateKey);
    await StorageService.deleteFile(filename);
  };
}

const instance = new FilesService();

module.exports = instance;
