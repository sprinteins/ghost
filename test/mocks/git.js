const fs = require('fs');
const { join } = require('path');

const file = process.argv.length >= 3 ? process.argv[2] : 'sample.txt';
fs.readFile(join(__dirname, file), (err, data) => {
  if (err) throw err;
  process.stdout.write(data);
});
