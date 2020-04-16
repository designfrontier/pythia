const fs = require('fs');
const path = require('path');
const readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

module.exports = (location = '.pythia-config') => {
  const filePath = path.join(process.cwd(), location);
  const configFile = fs.existsSync(filePath) ? readFile(filePath) : {};
  const exclude = configFile.exclude ? readFile(filePath).exclude : {};
  const institutionalOwners = configFile.owners
    ? readFile(configFile.owners)
    : {};
  const threshold = configFile.threshold || 20;

  ['users', 'directories', 'files', 'shas'].forEach((item) => {
    if (typeof exclude[item] === 'undefined') {
      exclude[item] = [];
    }
  });

  // convert all shas to short version
  exclude.shas = exclude.shas.map((i) => i.substring(0, 8));

  if (typeof exclude.comments === 'undefined') {
    exclude.comments = {};
  }

  return {
    exclude,
    threshold,
    institutionalOwners,
  };
};
