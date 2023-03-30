const CryptoJS = require("crypto-js");

class FileKeyService {
  static SECRET_PUBLIC_KEY = process.env.SECRET_PUBLIC_KEY || "FILE_SECRET_PUBLIC_KEY";

  static SECRET_PRIVATE_KEY = process.env.SECRET_PRIVATE_KEY || "FILE_SECRET_PRIVATE_KEY";

  static generateFileKeys = (file) => {
    const { filename, mimetype, originalname } = file;
    const payload = JSON.stringify({ filename, mimetype, originalname });
    let privateKey = CryptoJS.AES.encrypt(payload, this.SECRET_PRIVATE_KEY).toString();
    let publicKey = CryptoJS.AES.encrypt(payload, this.SECRET_PUBLIC_KEY).toString();
    privateKey = encodeURIComponent(privateKey);
    publicKey = encodeURIComponent(publicKey);

    return { privateKey, publicKey };
  };

  static decryptPrivateKey = (privateKey) => {
    try {
      privateKey = decodeURIComponent(privateKey);
      const text = CryptoJS.AES.decrypt(privateKey, this.SECRET_PRIVATE_KEY).toString(CryptoJS.enc.Utf8);
      return JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid Private Key");
    }
  };

  static decryptPublicKey = (publicKey) => {
    try {
      publicKey = decodeURIComponent(publicKey);
      const text = CryptoJS.AES.decrypt(publicKey, this.SECRET_PUBLIC_KEY).toString(CryptoJS.enc.Utf8);
      return JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid Public Key");
    }
  };
}

module.exports = FileKeyService;
