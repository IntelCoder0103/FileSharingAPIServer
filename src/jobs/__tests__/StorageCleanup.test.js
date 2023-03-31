const fs = require("fs").promises;
const path = require("path");
const { clearInactiveFiles } = require("../StorageCleanup");
const { FILE_FOLDER, INACTIVE_PERIOD} = require("../../config")

describe("Storage Cleanup Cron Job", () => {
  describe("clearInactiveFiles", () => {

    beforeEach(() => {
      fs.stat = jest.fn().mockResolvedValue({
        atimeMs: new Date().getTime() - INACTIVE_PERIOD - 1000, // set the access time to be older than INACTIVE_PERIOD
      });
      fs.unlink = jest.fn().mockResolvedValue();
    });

    it("should delete inactive files in the upload directory", async () => {
      const uploadDir = path.resolve(`./${FILE_FOLDER}`);
      const files = ["file1.txt", "file2.txt", "file3.txt"];
      const now = Date.now();
      fs.readdir = jest.fn().mockResolvedValue(files);
      fs.stat
        .mockResolvedValueOnce({ atimeMs: now - 100 })
        .mockResolvedValueOnce({ atimeMs: now - INACTIVE_PERIOD - 100 })
        .mockResolvedValueOnce({atimeMs: now - 200})

      await clearInactiveFiles();

      expect(fs.readdir).toHaveBeenCalledWith(uploadDir);

      files.forEach((file, index) => {
        const filePath = path.join(uploadDir, file);
        expect(fs.stat).toHaveBeenCalledWith(filePath);
        if(index == 1)
          expect(fs.unlink).toHaveBeenCalledWith(filePath);
      });
    });

    it("should handle errors thrown during file deletion", async () => {
      const error = new Error("Failed to delete file");
      fs.readdir = jest.fn().mockResolvedValue(["file1.txt"]);
      fs.unlink = jest.fn().mockRejectedValue(error);

      await clearInactiveFiles();

      expect(fs.readdir).toHaveBeenCalled();
      expect(fs.unlink).toHaveBeenCalled();
    });

    it("should handle errors thrown during file stat", async () => {
      const error = new Error("Failed to read file stats");
      fs.readdir = jest.fn().mockResolvedValue(["file1.txt"]);
      fs.stat = jest.fn().mockRejectedValue(error);

      await clearInactiveFiles();

      expect(fs.readdir).toHaveBeenCalled();
      expect(fs.stat).toHaveBeenCalled();
    });
  });
});
