const fs = require('fs');

function getFilesizeInBytes(filename) {
  let stats = fs.statSync(filename);
  let fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

module.exports = getFilesizeInBytes;
