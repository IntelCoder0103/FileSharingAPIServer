const storageService = require("../StorageService");
const filesService = require("../FilesService");
const FileKeyService = require("../FileKeyService");
const fs = require("fs").promises;
const path = require("path");

const { FILE_FOLDER } = require("../../config");
var mockPipe = jest.fn();

jest.mock('../StorageService', () => ({
  uploadFile: jest.fn(),
  downloadStream: jest.fn().mockResolvedValue({
    stream: {
      pipe: mockPipe
    }
  }),
  deleteFile: jest.fn()
}));

describe("FilesService", () => {

  beforeEach(() => {
  });

  describe("createFile", () => {
    it("should call FileKeyService.generateFileKeys with the file and return the keys", async () => {
      const file = { mimetype: "text/plain", name: "file.txt", originalName: "file.txt" };
      const generateFileKeysSpy = jest.spyOn(FileKeyService, "generateFileKeys").mockReturnValue(["key1", "key2"]);

      const result = await filesService.createFile(file);

      expect(generateFileKeysSpy).toHaveBeenCalledWith(file);
      expect(storageService.uploadFile).toHaveBeenCalled();
      expect(result).toEqual(["key1", "key2"]);

      generateFileKeysSpy.mockRestore();
    });
  });

  describe("getFile", () => {
    it("should call FileKeyService.decryptPublicKey with the public key and return the decrypted key data", async () => {
      const publicKey = "publicKey123";
      const keyData = { filename: "file123.txt", originalname: "file.txt", mimetype: "text/plain" };
      const decryptPublicKeySpy = jest.spyOn(FileKeyService, "decryptPublicKey").mockReturnValue(keyData);

      const result = await filesService.getFile(publicKey);

      expect(decryptPublicKeySpy).toHaveBeenCalledWith(publicKey);
      expect(storageService.downloadStream).toHaveBeenCalledWith(keyData.filename);

      decryptPublicKeySpy.mockRestore();
    });
  });

  describe("deleteFile", () => {
    it("should delete the file and return successfully", async () => {
      const privateKey = "privateKey123";
      const keyData = { filename: "file123.txt" };
      const decryptPrivateKeySpy = jest.spyOn(FileKeyService, "decryptPrivateKey").mockReturnValue(keyData);
      //const unlinkSpy = jest.spyOn(fs, "unlink").mockResolvedValue();

      await filesService.deleteFile(privateKey);

      expect(decryptPrivateKeySpy).toHaveBeenCalledWith(privateKey);
      expect(storageService.deleteFile).toHaveBeenCalledWith(keyData.filename);
      //expect(unlinkSpy).toHaveBeenCalledWith(path.resolve(`./${FILE_FOLDER}/${keyData.filename}`));

      decryptPrivateKeySpy.mockRestore();
      //unlinkSpy.mockRestore();
    });

    it("should throw an error if the file deletion fails", async () => {
      const privateKey = "privateKey123";
      const keyData = { filename: "file123.txt" };
      const decryptPrivateKeySpy = jest.spyOn(FileKeyService, "decryptPrivateKey").mockReturnValue(keyData);
      storageService.deleteFile.mockRejectedValue(new Error("Delete File Error"));
      //const unlinkSpy = jest.spyOn(fs, "unlink").mockRejectedValue(new Error("Failed to delete file"));

      await expect(filesService.deleteFile(privateKey)).rejects.toThrowError("Delete File Error");

      expect(decryptPrivateKeySpy).toHaveBeenCalledWith(privateKey);
      //expect(unlinkSpy).toHaveBeenCalledWith(path.resolve(`./${FILE_FOLDER}/${keyData.filename}`));

      decryptPrivateKeySpy.mockRestore();
      //unlinkSpy.mockRestore();
    });
  });
});
