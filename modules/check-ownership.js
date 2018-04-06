const cp = require('child_process')
      path = require('path');

module.exports = (details, publish) => {
  const { size, ownedLines, author, filePath, currentAuthor } = details;
  const ownership = (ownedLines / size) * 100;

  if (ownership >= 20 && author !== currentAuthor) {
    if (publish)  {
      cp.execFile(path.join(process.cwd(), '.pythia-publish'), [author, ownership, filePath], (err, out) => {
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
