const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const split = require('split');
const getEmail = require('./get-email');
const utils = require('./check-ownership');
const isCommentLine = (line, commentChar) =>
  commentChar && RegExp(`^\\s*${commentChar}.*`, 'i').test(line);
const getFileLength = (file, config, cb) => {
  const commentChar = config.exclude.comments[path.extname(file)];
  const commentIndices = [];
  let currentLine = 0;

  if (!file) {
    cb();
    return;
  }

  fs.createReadStream(file)
    .pipe(split(null, null, { trailing: false }))
    .on('data', chunk => {
      if (isCommentLine(chunk, commentChar)) {
        commentIndices.push(currentLine);
      }
      currentLine++;
    })
    .on('end', () => {
      // eslint-disable-next-line standard/no-callback-literal
      cb(currentLine - commentIndices.length, commentIndices);
    });
};

module.exports = ({ file, excludeUsers, publish, currentAuthor, config }) => {
  getFileLength(file, config, (lines, commentIndices) => {
    cp.exec(
      `git blame -w --show-email HEAD~1 -- ${file}`,
      (_, stdout, stderr) => {
        const emails = stdout.split('\n').reduce((accum, line, lineIndex) => {
          const sha = line.split(' ').shift();
          let prevBlame;

          if (config.exclude.shas && config.exclude.shas.includes(sha)) {
            // if this line has a blacklisted sha... get the previous versions change
            do {
              const thisSha = prevBlame ? prevBlame.split(' ')[0] : sha;

              prevBlame = cp
                .execSync(
                  `git blame -w --show-email ${thisSha}~1 -L ${lineIndex},${lineIndex} -- ${file}`
                )
                .toString();
            } while (config.exclude.shas.includes(prevBlame.split(' ')[0]));
          }
          const email = prevBlame ? getEmail(prevBlame) : getEmail(line);

          if (
            !email ||
            excludeUsers.includes(email) ||
            commentIndices.includes(lineIndex)
          ) {
            return accum;
          }

          if (typeof accum[email] !== 'undefined') {
            accum[email] = accum[email] + 1;
          } else {
            accum[email] = 1;
          }

          return accum;
        }, {});

        Object.keys(emails).forEach(email => {
          utils.checkOwnership(
            {
              size: lines,
              ownedLines: emails[email],
              author: email,
              filePath: file,
              currentAuthor,
              threshold: config.threshold
            },
            publish
          );
        });
      }
    );
  });
};
