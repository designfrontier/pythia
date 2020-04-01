const cp = require('child_process');
const path = require('path');

module.exports.checkOwnership = (details, publish) => {
  const {
    size,
    ownedLines,
    author,
    filePath,
    currentAuthor,
    threshold,
  } = details;
  const ownership =
    (ownedLines / size) * 100 > 100
      ? 100 // cap ownership percentage at 100%
      : (ownedLines / size) * 100;

  if (ownership >= threshold && author !== currentAuthor) {
    if (publish) {
      cp.execFile(
        path.join(process.cwd(), '.pythia-publish'),
        [author, ownership.toFixed(2), filePath],
        (err, out) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(err);
          }

          if (out !== '' && out !== '\n' && out !== ' ') {
            // eslint-disable-next-line no-console
            console.log(out.replace(/\n$/, ''));
          }
        }
      );
    }
    // eslint-disable-next-line no-console
    console.log(
      `${author} owns: ${ownership.toFixed(2)} percent of ${filePath}`
    );
  }
};
