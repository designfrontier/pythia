import { readFileSync } from 'fs';
import { join } from 'path';

export const writeHeader = () => {
  // eslint-disable-next-line no-console
  write(`



${readFileSync(join(__dirname, '../modules/header.txt'), 'utf8')}

Looking into the past to save the future...

-------------------------------------------
  `);
};
export const writeFooter = () => {
  // eslint-disable-next-line no-console
  write(`-------------------------------------------

  `);
};

export const write = (input: string | Error) => {
  console.log(input);
};
