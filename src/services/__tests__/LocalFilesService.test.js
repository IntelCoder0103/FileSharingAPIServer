const filesService = require("../LocalFilesService");
const FileKeyService = require("../FileKeyService");
const fs = require("fs").promises;
const path = require("path");

const { FILE_FOLDER } = require("../../config");

describe("FilesService", () => {

  beforeEach(() => {
  });

  describe("createFile", () => {
    it("should call FileKeyService.generateFileKeys with the file and return the keys", () => {
      const file = { mimetype: "text/plain", name: "file.txt", originalName: "file.txt" };
      const generateFileKeysSpy = jest.spyOn(FileKeyService, "generateFileKeys").mockReturnValue(["key1", "key2"]);

      const result = filesService.createFile(file);

      expect(generateFileKeysSpy).toHaveBeenCalledWith(file);
      expect(result).toEqual(["key1", "key2"]);

      generateFileKeysSpy.mockRestore();
    });
  });

  describe("getFile", () => {
    it("should call FileKeyService.decryptPublicKey with the public key and return the decrypted key data", () => {
      const publicKey = "publicKey123";
      const keyData = { filename: "file123.txt", originalname: "file.txt", mimetype: "text/plain" };
      const decryptPublicKeySpy = jest.spyOn(FileKeyService, "decryptPublicKey").mockReturnValue(keyData);

      const result = filesService.getFile(publicKey);

      expect(decryptPublicKeySpy).toHaveBeenCalledWith(publicKey);
      expect(result).toEqual(keyData);

      decryptPublicKeySpy.mockRestore();
    });
  });

  describe("deleteFile", () => {
    it("should delete the file and return successfully", async () => {
      const privateKey = "privateKey123";
      const keyData = { filename: "file123.txt" };
      const decryptPrivateKeySpy = jest.spyOn(FileKeyService, "decryptPrivateKey").mockReturnValue(keyData);
      const unlinkSpy = jest.spyOn(fs, "unlink").mockResolvedValue();

      await filesService.deleteFile(privateKey);

      expect(decryptPrivateKeySpy).toHaveBeenCalledWith(privateKey);
      expect(unlinkSpy).toHaveBeenCalledWith(path.resolve(`./${FILE_FOLDER}/${keyData.filename}`));

      decryptPrivateKeySpy.mockRestore();
      unlinkSpy.mockRestore();
    });

    it("should throw an error if the file deletion fails", async () => {
      const privateKey = "privateKey123";
      const keyData = { filename: "file123.txt" };
      const decryptPrivateKeySpy = jest.spyOn(FileKeyService, "decryptPrivateKey").mockReturnValue(keyData);
      const unlinkSpy = jest.spyOn(fs, "unlink").mockRejectedValue(new Error("Failed to delete file"));

      await expect(filesService.deleteFile(privateKey)).rejects.toThrowError("Delete File Error");

      expect(decryptPrivateKeySpy).toHaveBeenCalledWith(privateKey);
      expect(unlinkSpy).toHaveBeenCalledWith(path.resolve(`./${FILE_FOLDER}/${keyData.filename}`));

      decryptPrivateKeySpy.mockRestore();
      unlinkSpy.mockRestore();
    });
  });
});
