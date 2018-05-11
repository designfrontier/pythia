const cp = require('child_process')
      path = require('path');

module.exports = (details, publish) => {
  const { size, ownedLines, author, filePath, currentAuthor, config } = details;
  const ownership = (ownedLines / size) * 100;

  if (ownership >= config.threshold /*&& author !== currentAuthor*/) {
    if (publish)  {
      console.log(config);
      cp.execFile(path.join(process.cwd(), config.publish), [author, ownership.toFixed(2), filePath], (err, out) => {
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
