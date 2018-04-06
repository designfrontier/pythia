const fs = require('fs'),
      path = require('path'),
      readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

module.exports = (location = '.') => {
  const filePath = path.join(process.cwd(), location, '.pythia-config');
  const exclude = fs.existsSync(filePath) && readFile(filePath).exclude ? readFile(filePath).exclude : {};

  ['users', 'directories', 'files'].forEach((item) => {
    if (typeof exclude[item] === 'undefined') {
      exclude[item] = [];
    }
  });

  return {
  	exclude
  };
};