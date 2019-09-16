const fs = require('fs');
const path = require('path');

const writeHeader = () => {
  // eslint-disable-next-line no-console
  console.log(`



${fs.readFileSync(path.join(__dirname, '../modules/header.txt'), 'utf8')}

Looking into the past to save the future...

-------------------------------------------
  `);
};
const writeFooter = () => {
  // eslint-disable-next-line no-console
  console.log(`-------------------------------------------

  `);
};

module.exports = {
  writeFooter,
  writeHeader
};
