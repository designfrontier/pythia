import { existsSync, readFileSync } from 'fs';
import { join, parse } from 'path';

import { write } from './output';

export type Config = {
  exclude: {
    users: string[];
    files: string[];
    shas: string[];
    directories: string[];
    comments: {
      [key: string]: string;
    };
  };
  threshold: number;
};

let config: Config;

const readFile = (filePath: string) =>
  JSON.parse(readFileSync(filePath, 'utf8'));

export const readConfig = (location = '.pythia-config') => {
  const filePath = join(process.cwd(), location);
  const configFile = existsSync(filePath) ? readFile(filePath) : {};
  const exclude = configFile.exclude ? readFile(filePath).exclude : {};
  const threshold = configFile.threshold || 20;

  ['users', 'directories', 'files', 'shas'].forEach((item) => {
    if (typeof exclude[item] === 'undefined') {
      exclude[item] = [];
    }
  });

  // convert all shas to short version
  exclude.shas = exclude.shas.map((i: string) => i.substring(0, 8));

  if (typeof exclude.comments === 'undefined') {
    exclude.comments = {};
  }

  return {
    exclude,
    threshold,
  };
};

export const isExcluded = (filePath: string) => {
  const parsed = parse(filePath),
    isExcludedFile = config.exclude.files.includes(filePath),
    isExcludedDir = config.exclude.directories.length
      ? new RegExp('^' + config.exclude.directories.join('|^')).test(parsed.dir)
      : false;

  return isExcludedFile || isExcludedDir;
};

export const getConfigFileLocation = () => {
  const indx = process.argv.indexOf('--config') + 1;

  if (indx + 1 > process.argv.length || /^--/.exec(process.argv[indx])) {
    write('Please provide a file with your --config flag');
    process.exit(1);
  }

  return process.argv.indexOf('--config') > 0 ? process.argv[indx] : undefined;
};

export const initConfig = (): Config => {
  config = readConfig(getConfigFileLocation());

  return config;
};
