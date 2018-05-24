const fs = require('fs'),
      cp = require('child_process'),
      split = require('split'),
      getEmail = require('./get-email'),
      checkOwnership = require('./check-ownership'),
      getFileLength = (file, cb) => {
        let lines = 0;

        if (!file) {
          cb();
          return;
        }

        fs.createReadStream(file)
          .pipe(split())
          .on('data', (chunk) => {
            lines++;
          })
          .on('end', () => {
            cb(lines);
          });
      };

module.exports = ({file, excludeUsers, publish, currentAuthor, config}) => {
  getFileLength(file, (lines) => {
    cp.exec(`git blame -w --show-email HEAD~1 -- ${file}`, (error, stdout, stderr) => {
      const emails = stdout.split('\n').reduce((accum, line) => {
        const email = getEmail(line);
        
        if (!email || excludeUsers.includes(email)) {
          return accum;
        }

        if (typeof accum[email] !== 'undefined') {
          accum[email] = accum[email] + 1;
        } else {
          accum[email] = 1;
        }
        return accum;
      }, {});

      Object.keys(emails).forEach((email) => {
        // { size, ownedLines, author, file_path }
        checkOwnership({
          size: lines,
          ownedLines: emails[email],
          author: email,
          filePath: file,
          currentAuthor,
          config
        }, publish);
      });
    });
  });
};
