const fs = require("fs");
const path = require("path");
const FileKeyService = require("./FileKeyService");

const { FILE_FOLDER } = require("../config");

const { Storage } = require("@google-cloud/storage");
const { GCS_CONFIG, GCS_CONFIG_PATH } = require("../config");

class GoogleCloudStorageService {
  constructor() {
    this.storage = new Storage({
      projectId: "my-project",
      keyFilename: GCS_CONFIG_PATH,
    });
    this.bucketName = GCS_CONFIG['file_bucket'];
    this.bucket = this.storage.bucket(this.bucketName);
  }

  uploadFile = async (file) => {
    const blob = this.bucket.file(file.filename);
    await new Promise((res, rej) => {
      const stream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
      stream.on("finish", res);
      stream.on("error", rej);

      stream.end(file.buffer);
    })
  };

  downloadStream = async (filename) => {
    const stream = this.bucket.file(filename).createReadStream();
    return stream;
  };

  deleteFile = async (filename) => {
    try {
      await this.bucket.file(filename).delete();
    } catch (e) {
      throw new Error("Delete File Error");
    }
  };
}

const serviceInstance = new GoogleCloudStorageService();
module.exports = serviceInstance;
