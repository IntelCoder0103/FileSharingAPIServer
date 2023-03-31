const filesController = require("../FilesController");
const { FilesService } = require("../../services");
const path = require("path");
const { FILE_FOLDER } = require("../../config");

describe("FilesController", () => {

  beforeEach(() => {
  });

  describe("createFile", () => {
    it("should call FilesService.createFile with the correct arguments", async () => {
      const req = { file: { mimetype: "text/plain", name: "file.txt", originalName: "file.txt" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      console.log(FilesService);
      const createFileSpy = jest.spyOn(FilesService, "createFile").mockReturnValue(["key1", "key2"]);

      await filesController.createFile(req, res);

      expect(createFileSpy).toHaveBeenCalledWith(req.file);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(["key1", "key2"]);

      createFileSpy.mockRestore();
    });
  });

  describe("readFile", () => {
    it("should call FilesService.getFile and send the file to the client", async () => {
      const req = { params: { publicKey: "publicKey123" } };
      const res = { setHeader: jest.fn(), sendFile: jest.fn(), status: jest.fn().mockReturnThis() };
      const getFileSpy = jest.spyOn(FilesService, "getFile").mockReturnValue({
        filename: "file123.txt",
        originalname: "file.txt",
        mimetype: "text/plain",
      });

      await filesController.readFile(req, res);

      expect(getFileSpy).toHaveBeenCalledWith(req.params.publicKey);
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/plain");
      expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", "attachment; filename=file.txt");
      expect(res.sendFile).toHaveBeenCalledWith(path.resolve(`./${FILE_FOLDER}/file123.txt`));

      getFileSpy.mockRestore();
    });

    it("should return an error response if FilesService.getFile throws an error", async () => {
      const req = { params: { publicKey: "publicKey123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const getFileSpy = jest.spyOn(FilesService, "getFile").mockImplementation(() => {
        throw new Error("File not found");
      });

      await filesController.readFile(req, res);

      expect(getFileSpy).toHaveBeenCalledWith(req.params.publicKey);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "File not found" });

      getFileSpy.mockRestore();
    });
  });

  describe("deleteFile", () => {
    it("should call FilesService.deleteFile with the correct argument", async () => {
      const req = { params: { privateKey: "privateKey123" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
      const deleteFileSpy = jest.spyOn(FilesService, "deleteFile").mockResolvedValue();

      await filesController.deleteFile(req, res);

      expect(deleteFileSpy).toHaveBeenCalledWith(req.params.privateKey);
      expect(res.status).toHaveBeenCalledWith(200);

      deleteFileSpy.mockRestore();
    });

     it("should return an error response if FilesService.deleteFile throws an error", async () => {
       const req = { params: { privateKey: "privateKey123" } };
       const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
       const deleteFileSpy = jest.spyOn(FilesService, "deleteFile").mockRejectedValue(new Error("error"));

       await filesController.deleteFile(req, res);

       expect(deleteFileSpy).toHaveBeenCalledWith(req.params.privateKey);
       expect(res.status).toHaveBeenCalledWith(500);
       expect(res.json).toHaveBeenCalled();

       deleteFileSpy.mockRestore();
     });
  });
});
