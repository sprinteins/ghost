function sortDirectory(dir) {
  return dir.sort((a, b) => {
    if (a.isDir && b.isDir) {
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return -1;
    }
    if (a.isDir && !b.isDir) {
      return -1;
    }
    if (!a.isDir && b.isDir) {
      return 1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return -1;
  });
}

module.exports = {
  sortDirectory,
};
