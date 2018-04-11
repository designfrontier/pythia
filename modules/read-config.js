const fs = require('fs'),
      path = require('path'),
      readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

module.exports = (location = '.') => {
  const filePath = path.join(process.cwd(), location, '.pythia-config');
  const configFile = fs.existsSync(filePath) ? readFile(filePath) : {};
  const exclude = configFile.exclude ? readFile(filePath).exclude : {};
  const threshold = configFile.threshold || 20;

  ['users', 'directories', 'files'].forEach((item) => {
    if (typeof exclude[item] === 'undefined') {
      exclude[item] = [];
    }
  });

  return {
  	exclude,
    threshold
  };
};