const cp = require('child_process'),
      fs = require('fs'),
      path = require('path'),
      checkForPublishFile = require('./check-for-publish-file');

module.exports = (details, publish) => {
  const { size, ownedLines, author, filePath, currentAuthor, config } = details,
        ownership = (ownedLines / size) * 100,
        publishFile = config.publish;

  if (ownership >= config.threshold && author !== currentAuthor) {
    if (publish && checkForPublishFile(publishFile)) {
      cp.execFile(publishFile, [author, ownership.toFixed(2), filePath], (err, out) => {
        if (err) {
          console.log(err);
        }

        if (out !== '' && out !== '\n' && out !== ' ') {
          console.log(out.replace(/\n$/, ''));
        }
      });
    }
    console.log(`${author} owns: ${ownership.toFixed(2)} percent of ${filePath}`);
  }
};
