const fs = require('fs');
const path = require('path');

const clearDirectory = () => (
    fs.readdir('./PDFs', (err, files) => {
      if (err) throw err;
      for (const file of files) {
        fs.unlink(path.join('./PDFs', file), err => {
          if (err) throw err;
        });
      }
    })
  );

module.exports = clearDirectory;