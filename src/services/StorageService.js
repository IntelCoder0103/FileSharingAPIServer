const LocalStorageService = require('./LocalStorageService');
const GoogleCloudStorageService = require('./GCStorageService');

var storageService;
if (process.env.PROVIDER == "google")
  storageService = GoogleCloudStorageService;
else storageService = LocalStorageService;

module.exports = storageService;