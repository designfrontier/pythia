import { parse } from 'path';
import type { Config } from './read-config';

export const fileIsExcluded = (filePath: string, config: Config) => {
  const parsed = parse(filePath);
  const isExcludedFile =
    config.exclude.files && config.exclude.files.includes(filePath);
  const isExcludedDir =
    config.exclude.directories &&
    new RegExp('^' + config.exclude.directories.join('|^')).test(
      parsed.dir + '/'
    );

  return !!isExcludedFile || !!isExcludedDir;
};
