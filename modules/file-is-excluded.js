module.exports = (filePath, config) => {
  const path = require('path'),
    parsed = path.parse(filePath),
    isExcludedFile = config.exclude.files && config.exclude.files.includes(filePath),
    isExcludedDir = config.exclude.directories && new RegExp('^' + config.exclude.directories.join('|^')).test(parsed.dir + '/');

  return !!isExcludedFile || !!isExcludedDir;
};