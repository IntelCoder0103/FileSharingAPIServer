const path = require('path');
const fs = require('fs').promises;
const { CronJob } = require('cron');

const { FILE_FOLDER, INACTIVE_PERIOD } = require("../config");

const clearInactiveFiles = async () => {
  console.log('clear inactive');
  // get the current time
  const now = new Date().getTime();

  const uploadDir = path.resolve(`./${FILE_FOLDER}`);
  // get a list of all files in the upload directory
  try{
  const files = await fs.readdir(uploadDir);
    for (let file of files) {
      const filePath = path.join(uploadDir, file);
      try {
        const stats = await fs.stat(filePath);
        // if the file has not been modified in the last inactivePeriod milliseconds, delete it
        //console.log(filePath, stats.atime, stats.atimeMs);
        if (now - stats.atimeMs > INACTIVE_PERIOD) {
          await fs.unlink(filePath);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }catch (e) {
    console.log(e);
  }
};

const job = new CronJob("0 0 0 * * *", clearInactiveFiles);

module.exports = {
  clearInactiveFiles,
  start: clearInactiveFiles
}