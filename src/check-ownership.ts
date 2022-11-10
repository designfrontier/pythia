import { execFile } from 'child_process';
import { join } from 'path';
import { write } from './output';

export type Details = {
  size: number;
  ownedLines: number;
  author: string;
  filePath: string;
  currentAuthor: string;
  threshold: number;
};

export const checkOwnership = (details: Details, publish: boolean) => {
  const { size, ownedLines, author, filePath, currentAuthor, threshold } =
    details;
  const ownership =
    (ownedLines / size) * 100 > 100
      ? 100 // cap ownership percentage at 100%
      : (ownedLines / size) * 100;

  if (ownership >= threshold && author !== currentAuthor) {
    if (publish) {
      execFile(
        join(process.cwd(), '.pythia-publish'),
        [author, ownership.toFixed(2), filePath],
        (err, out) => {
          if (err) {
            // eslint-disable-next-line no-console
            write(err);
          }

          if (out !== '' && out !== '\n' && out !== ' ') {
            // eslint-disable-next-line no-console
            write(out.replace(/\n$/, ''));
          }
        }
      );
    }
    // eslint-disable-next-line no-console
    write(`${author} owns: ${ownership.toFixed(2)} percent of ${filePath}`);
  }
};
