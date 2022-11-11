import { readConfig } from './config';

test('for an empty config file', () => {
  expect(readConfig('fixtures/.empty-config')).toEqual({
    threshold: 20,
    exclude: {
      users: [],
      directories: [],
      files: [],
      comments: {},
      shas: [],
    },
  });
});

test('for a malformed config file', () => {
  expect(() => readConfig('fixtures/.malformed-config')).toThrowError(
    SyntaxError
  );
});

test('for a config file with threshold', () => {
  expect(readConfig('fixtures/.threshold-config').threshold).toBe(42);
});

test('for a config file with excluded users', () => {
  expect(readConfig('fixtures/.exclude-users-config').exclude.users).toEqual([
    'test1@example.com',
    'test2@example.com',
  ]);
});

test('for a config file with excluded directories', () => {
  expect(
    readConfig('fixtures/.exclude-directories-config').exclude.directories
  ).toEqual(['dir-one', 'dir-two']);
});

test('for a config file with excluded files', () => {
  expect(readConfig('fixtures/.exclude-files-config').exclude.files).toEqual([
    'file-one',
    'file-two',
  ]);
});

test('for a config file without excluded shas', () => {
  expect(readConfig('fixtures/.exclude-files-config').exclude.shas).toEqual([]);
});

test('for a config file with excluded shas', () => {
  expect(readConfig('fixtures/.exclude-shas-config').exclude.shas).toEqual([
    'bed1a172',
  ]);
});

test('for a config file with excluded comments', () => {
  expect(
    readConfig('fixtures/.exclude-comments-config').exclude.comments
  ).toEqual({ rb: '#', js: '//' });
});

test('for a full featured config file', () => {
  expect(readConfig('fixtures/.pythia-config')).toEqual({
    threshold: 43,
    exclude: {
      users: ['test1@example.com', 'test2@example.com'],
      directories: ['dir-one', 'dir-two'],
      files: ['file-one', 'file-two'],
      comments: { rb: '#', js: '//' },
      shas: [],
    },
  });
});
