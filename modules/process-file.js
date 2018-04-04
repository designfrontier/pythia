const fs = require('fs'),
      cp = require('child_process'),
      split = require('split'),
      getEmail = require('modules/get-email'),
      checkOwnership = require('modules/check-ownership'),
      getFileLength = (file, cb) => {
        let lines = 0;

        fs.createReadStream(file)
          .pipe(split())
          .on('data', (chunk) => {
            lines++;
          })
          .on('end', () => {
            cb(lines);
          });
      };
      
module.exports = (file) => {
  getFileLength(file, (lines) => {
    cp.exec(`git blame --show-email HEAD~1 -- ${file}`, (error, stdout, stderr) => {
      const emails = stdout.split('\n').reduce((accum, line) => {
        const email = getEmail(line);

        if (typeof accum[email] !== 'undefined') {
          accum[email] = 1;
        } else {
          accum[email] = accum[email] + 1;
        }

        return accum;
      }, {});

      Object.keys(emails).forEach((email) => {
        checkOwnership({lines, emails[email], email, file})
      });
    });
  });
};