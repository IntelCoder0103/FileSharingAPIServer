const localFileService = require('./LocalFilesService');
const FileKeyService = require('./FileKeyService');
const FilesService = localFileService;

module.exports = {
  FilesService,
  FileKeyService
}