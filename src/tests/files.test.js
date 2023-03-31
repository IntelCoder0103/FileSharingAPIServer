const request = require("supertest");
const FilesService = require("../services/FilesService");
const app = require("../app");
const fs = require('fs');
const path = require('path');

describe("FilesController", () => {
  describe("POST /files", () => {
    it("should upload a file", async () => {
      
      const filePath = path.join(__dirname + "/attach.txt");

      const response = await request(app).post("/files").attach("file", filePath).expect(201);

      const { publicKey } = response.body;

      const keyData = await FilesService.getFile(publicKey);

      expect(keyData.originalname).toEqual('attach.txt');
      expect(keyData.mimetype).toEqual('text/plain');
    });
  });

  describe("GET /files/:publicKey", () => {
    let file, publicKey, privateKey;
    const filePath = path.join(__dirname + "/attach.txt");
    
    beforeEach(async () => {
      const buffer = await fs.promises.readFile(filePath);
      file = { mimetype: "text/plain", originalname: "attach.txt", filename: "attach.txt", buffer };
      const data = (await FilesService.createFile(file));
      publicKey = data.publicKey;
      privateKey = data.privateKey;
    });

    afterEach(async () => {
      await FilesService.deleteFile(privateKey);
    });
    it("should download a file", async () => {

      const response = await request(app).get(`/files/${publicKey}`).expect(200);

      expect(response.headers["content-type"]).toEqual(file.mimetype);
      expect(response.headers["content-disposition"]).toEqual(`attachment; filename=${file.filename}`);
    });
  });

  describe("DELETE /files/:privateKey", () => {
    let file, publicKey, privateKey;
    const filePath = path.join(__dirname + "/attach.txt");

    beforeEach(async () => {
      const buffer = await fs.promises.readFile(filePath);
      file = { mimetype: "text/plain", originalname: "attach.txt", filename: "attach.txt", buffer };
      const data = await FilesService.createFile(file);
      publicKey = data.publicKey;
      privateKey = data.privateKey;
    });

    afterEach(async () => {
    });

    it("should delete a file", async () => {

      await request(app).delete(`/files/${privateKey}`).expect(200);

      try {
        await FilesService.getFile(publicKey);
      } catch (error) {
        expect(error.message).toEqual("File not found");
      }
    });
  });
});
