const fs = require('fs'),
      path = require('path'),
      readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8')),
      checkForPublishFile = require('./check-for-publish-file');

module.exports = ({ location = '.pythia-config', publish}) => {
  const filePath = path.join(process.cwd(), location),
        configFile = fs.existsSync(filePath) ? readFile(filePath) : {},
        exclude = configFile.exclude ? readFile(filePath).exclude : {},
        threshold = configFile.threshold || 20,
        publishFinal = publish || configFile.publish || '.pythia-publish',
        publishPath = path.isAbsolute(publishBase) ? publishBase : path.join(process.cwd(), publishBase);
 
  ['users', 'directories', 'files'].forEach((item) => {
    if (typeof exclude[item] === 'undefined') {
      exclude[item] = [];
    }
  });
  
  publishPath && checkForPublishFile(publishPath);

  return {
  	exclude,
    threshold,
    publish: publishPath
  };
};
