const FILE_FOLDER = process.env.FOLDER || "uploads";
const INACTIVE_PERIOD = 7 * 24 * 3600 * 1000;
module.exports = {
  FILE_FOLDER,
  INACTIVE_PERIOD
}