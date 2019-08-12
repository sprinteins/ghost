const fs = require('fs');

function getDirectory(dirName) {
  let fileFolderList = fs.readdirSync(dirName);
  fileFolderList = fileFolderList.map((item) => {
    const isDir = fs.lstatSync(`${dirName}/${item}`).isDirectory();
    return { name: item, isDir };
  });
  return fileFolderList;
}

module.exports = {
  getDirectory,
};
