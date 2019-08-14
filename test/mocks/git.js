const fs = require('fs');
const { join } = require('path');

fs.readFile(join(__dirname, 'glogExampleData.txt'), (err, data) => {
  if (err) throw err;
  process.stdout.write(data);
});
