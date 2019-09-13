const path = require('path');

module.exports = (filePath, config) => {
  const parsed = path.parse(filePath);
  const isExcludedFile =
    config.exclude.files && config.exclude.files.includes(filePath);
  const isExcludedDir =
    config.exclude.directories &&
    new RegExp('^' + config.exclude.directories.join('|^')).test(
      parsed.dir + '/'
    );

  return !!isExcludedFile || !!isExcludedDir;
};
