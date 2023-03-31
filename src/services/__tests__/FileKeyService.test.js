const fileKeysService = require('../FileKeyService');
describe("FileKeyService", () => {
  it("should generate the same after encrypt and decrypt again", async () => {
    const mockFiles = [
      { mimetype: "text/plain", filename: "file.txt", originalname: "file.txt" },
      { mimetype: "application/pdf", filename: "file.pdf", originalname: "file.pdf" },
      { mimetype: "png/image", filename: "file.png", originalname: "file.png" },
    ];
    for (const mockFile of mockFiles) {
      const { privateKey, publicKey } = fileKeysService.generateFileKeys(mockFile);
      expect(fileKeysService.decryptPrivateKey(privateKey)).toEqual(mockFile);
      expect(fileKeysService.decryptPublicKey(publicKey)).toEqual(mockFile);
    }
  });

  
  
})