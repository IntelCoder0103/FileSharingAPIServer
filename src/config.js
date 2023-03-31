const path = require('path');
const FILE_FOLDER = process.env.FOLDER || "uploads";
const INACTIVE_PERIOD = 7 * 24 * 3600 * 1000;

const GCS_CONFIG_PATH = path.resolve('./' + (process.env.CONFIG || "src/gcs.json"));
const GCS_CONFIG = require(GCS_CONFIG_PATH);

module.exports = {
  FILE_FOLDER,
  INACTIVE_PERIOD,
  GCS_CONFIG,
  GCS_CONFIG_PATH,
};