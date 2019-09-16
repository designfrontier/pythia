const fs = require('fs');
const path = require('path');

const writeHeader = () => {
  console.log('\n\n\n');
  console.log(
    fs.readFileSync(path.join(__dirname, '../modules/header.txt'), 'utf8')
  );
  console.log('\nLooking into the past to save the future...\n');
  console.log('-------------------------------------------');
};
const writeFooter = () => {
  console.log('-------------------------------------------');
  console.log('');
};

module.exports = {
  writeFooter,
  writeHeader
};
