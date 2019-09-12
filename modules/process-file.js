const fs = require('fs'),
  cp = require('child_process'),
  path = require('path'),
  split = require('split'),
  getEmail = require('./get-email'),
  utils = require('./check-ownership'),
  isCommentLine = (line, commentChar) => commentChar && RegExp(`^\\s*${commentChar}.*`, 'i').test(line),
  getFileLength = (file, config, cb) => {
    const commentChar = config.exclude.comments[path.extname(file)];
    const commentIndices = [];
    let currentLine = 0;

    if (!file) {
      cb();
      return;
    }

    fs.createReadStream(file)
      .pipe(split(null, null, { trailing: false }))
      .on('data', (chunk) => {
        if (isCommentLine(chunk, commentChar)) {
          commentIndices.push(currentLine);
        }
        currentLine++;
      })
      .on('end', () => {
        cb(currentLine - commentIndices.length, commentIndices);
      });
  };

module.exports = ({file, excludeUsers, publish, currentAuthor, config}) => {
  getFileLength(file, config, (lines, commentIndices) => {
    cp.exec(`git blame -w --show-email HEAD~1 -- ${file}`, (error, stdout, stderr) => {
      const emails = stdout.split('\n').reduce((accum, line, lineIndex) => {
        const sha = line.split(' ').shift();
        let prevBlame;

        if (config.exclude.shas.includes(sha)) {
          // if this line has a blacklisted sha... get the previous versions change
          prevBlame = cp.execSync(`git blame -w --show-email ${sha}~1 -L ${lineIndex},${lineIndex} -- ${file}`).toString();
        }

        const email = prevBlame ? getEmail(prevBlame) : getEmail(line);

        if (!email || excludeUsers.includes(email) || commentIndices.includes(lineIndex)) {
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
        utils.checkOwnership({
          size: lines,
          ownedLines: emails[email],
          author: email,
          filePath: file,
          currentAuthor,
          threshold: config.threshold
        }, publish);
      });
    });
  });
};
