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

// TODO make this bail if there is no actual file... or if a non-file is passed
//  in to the publish argument
  if (indx + 1 > process.argv.length || /^-/.exec(process.argv[indx])) {
  console.log('Please provide a file with your --publish flag');
  process.exit(1);
}

  return {
  	exclude,
    threshold,
    publish: publishFinal
  };
};
