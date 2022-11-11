#!/usr/bin/env node

import { processFile } from './process-file';
import { exec } from 'child_process';
import { stat } from 'fs';
import { join } from 'path';
import { writeHeader, writeFooter, write } from './output';
import { isExcluded, initConfig } from './config';

const config = initConfig();
const publishReviewRequests =
  process.argv.includes('--publish') || process.argv.includes('-p');

writeHeader();
exec(
  'git diff-tree --no-commit-id --name-only -r HEAD',
  (error, stdout, stderr) => {
    if (error) {
      write('Well.... something broke. Bad.');
    }

    exec('git log --format="%ae" -n 1', (err, out) => {
      // split on lines to get the list of files
      stdout.split('\n').forEach((file) => {
        const filePath = join(process.cwd(), file);

        stat(filePath, (err, stat) => {
          if (!err && stat.isFile() && !isExcluded(file)) {
            processFile({
              file,
              excludeUsers: config.exclude.users,
              publish: publishReviewRequests,
              currentAuthor: out.replace(/\n$/, ''),
              config,
            });
          }
        });
      });
    });
  }
);

process.on('exit', () => {
  writeFooter();
});
