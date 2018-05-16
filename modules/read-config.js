const fs = require('fs'),
      path = require('path'),
      readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

module.exports = ({ location = '.pythia-config', publish}) => {
  const filePath = path.join(process.cwd(), location);
  const configFile = fs.existsSync(filePath) ? readFile(filePath) : {};
  const exclude = configFile.exclude ? readFile(filePath).exclude : {};
  const threshold = configFile.threshold || 20;
  const publishFinal = publish || configFile.publish || '.pythia-publish';

  ['users', 'directories', 'files'].forEach((item) => {
    if (typeof exclude[item] === 'undefined') {
      exclude[item] = [];
    }
  });

  if (publish) {
    try {
      fs.statSync(path.join(process.cwd(), publish)).isFile();
    } catch (e) {
      console.log('Please provide a file with your --publish or -p flag');
      process.exit(1);
    }
  }

  return {
  	exclude,
    threshold,
    publish: publishFinal
  };
};
