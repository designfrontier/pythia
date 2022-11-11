import { createReadStream } from 'fs';
import { exec, execSync } from 'child_process';
import { extname } from 'path';
import * as split from 'split';
import { getEmail } from './get-email';
import { checkOwnership } from './check-ownership';

import type { Config } from './read-config';

const isCommentLine = (line: string, commentChar: string): boolean =>
  !!commentChar && RegExp(`^\\s*${commentChar}.*`, 'i').test(line);

const getFileLength = (
  file: string,
  config: Config,
  cb: (lines: number, commentIndices: number[]) => void
) => {
  const commentChar = config.exclude.comments[extname(file)];
  const commentIndices: number[] = [];
  let currentLine = 0;

  createReadStream(file)
    .pipe(split(null, null, { trailing: false }))
    .on('data', (chunk) => {
      if (isCommentLine(chunk, commentChar)) {
        commentIndices.push(currentLine);
      }
      currentLine++;
    })
    .on('end', () => {
      cb(currentLine - commentIndices.length, commentIndices);
    });
};

export const processFile = ({
  file,
  excludeUsers,
  publish,
  currentAuthor,
  config,
}: {
  file: string;
  excludeUsers: string[];
  publish: boolean;
  currentAuthor: string;
  config: Config;
}) => {
  getFileLength(file, config, (lines, commentIndices) => {
    exec(`git blame -w --show-email HEAD~1 -- ${file}`, (_, stdout, stderr) => {
      const emails = stdout
        .split('\n')
        .reduce(
          (
            accum: { [key: string]: number },
            line: string,
            lineIndex: number
          ) => {
            const sha = line.split(' ').shift() || '';
            let prevBlame;

            if (config.exclude.shas && config.exclude.shas.includes(sha)) {
              // if this line has a blacklisted sha... get the previous versions change
              do {
                const thisSha: string = prevBlame
                  ? prevBlame.split(' ')[0]
                  : sha;

                prevBlame = execSync(
                  `git blame -w --show-email ${thisSha}~1 -L ${lineIndex},${lineIndex} -- ${file}`
                ).toString();
              } while (config.exclude.shas.includes(prevBlame.split(' ')[0]));
            }
            const email = prevBlame ? getEmail(prevBlame) : getEmail(line);

            if (
              !email ||
              excludeUsers.includes(email) ||
              commentIndices.includes(lineIndex)
            ) {
              return accum;
            }

            if (typeof accum[email] !== 'undefined') {
              accum[email] = accum[email] + 1;
            } else {
              accum[email] = 1;
            }

            return accum;
          },
          {}
        );

      Object.keys(emails).forEach((email) => {
        checkOwnership(
          {
            size: lines,
            ownedLines: emails[email],
            author: email,
            filePath: file,
            currentAuthor,
            threshold: config.threshold,
          },
          publish
        );
      });
    });
  });
};
