const localStorageService = require("../LocalStorageService");
const fs = require("fs");
const path = require("path");

const { FILE_FOLDER } = require("../../config");

describe("LocalStorageService", () => {

  beforeEach(() => {
  });

  describe("uploadFile", () => {
    it("should call save file from memory storage to localstorage", async() => {
      const file = { mimetype: "text/plain", filename: "file.txt", originalname: "file.txt", buffer: [] };
      const writeFileSpy = jest.spyOn(fs.promises, "writeFile");

      const result = await localStorageService.uploadFile(file);
      const filePath = path.resolve(`./${FILE_FOLDER}/${file.filename}`);
      expect(writeFileSpy).toHaveBeenCalledWith(filePath, file.buffer);

    });
  });

  describe("downloadStream", () => {
    it("should read file stream on the local storage and return it", async() => {
      const filename = 'file.txt';
      const mockStream = {
        pipe: jest.fn(),
      };
      const createStreamSpy = jest.spyOn(fs, "createReadStream").mockReturnValue(mockStream);
      
      const result = await localStorageService.downloadStream(filename);

      expect(createStreamSpy).toHaveBeenCalledWith(path.resolve(`./${FILE_FOLDER}/${filename}`));
      expect(result).toEqual(mockStream);

      createStreamSpy.mockRestore();
    });
  });

  describe("deleteFile", () => {
    it("should delete the file and return successfully", async () => {
      const filename = 'file.txt';
      const unlinkSpy = jest.spyOn(fs.promises, "unlink").mockResolvedValue();

      await localStorageService.deleteFile(filename);

      expect(unlinkSpy).toHaveBeenCalledWith(path.resolve(`./${FILE_FOLDER}/${filename}`));

      unlinkSpy.mockRestore();
    });

    it("should throw an error if the file deletion fails", async () => {
      const filename = "file.txt";
      const unlinkSpy = jest.spyOn(fs.promises, "unlink").mockRejectedValue(new Error("Failed to delete file"));

      await expect(localStorageService.deleteFile(filename)).rejects.toThrowError("Delete File Error");

      expect(unlinkSpy).toHaveBeenCalledWith(path.resolve(`./${FILE_FOLDER}/${filename}`));

      unlinkSpy.mockRestore();
    });
  });
});
