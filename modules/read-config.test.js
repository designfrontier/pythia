/* eslint-disable jest/expect-expect, jest/no-test-callback */

const test = require('ava');
const readConfig = require('./read-config');

test('for an empty config file', (t) => {
  t.deepEqual(readConfig('fixtures/.empty-config'), {
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

test('for a malformed config file', (t) => {
  t.throws(() => readConfig('fixtures/.malformed-config'), SyntaxError);
});

test('for a config file with threshold', (t) => {
  t.is(readConfig('fixtures/.threshold-config').threshold, 42);
});

test('for a config file with excluded users', (t) => {
  t.deepEqual(readConfig('fixtures/.exclude-users-config').exclude.users, [
    'test1@example.com',
    'test2@example.com',
  ]);
});

test('for a config file with excluded directories', (t) => {
  t.deepEqual(
    readConfig('fixtures/.exclude-directories-config').exclude.directories,
    ['dir-one', 'dir-two']
  );
});

test('for a config file with excluded files', (t) => {
  t.deepEqual(readConfig('fixtures/.exclude-files-config').exclude.files, [
    'file-one',
    'file-two',
  ]);
});

test('for a config file without excluded shas', (t) => {
  t.deepEqual(readConfig('fixtures/.exclude-files-config').exclude.shas, []);
});

test('for a config file with excluded shas', (t) => {
  t.deepEqual(readConfig('fixtures/.exclude-shas-config').exclude.shas, [
    'bed1a172',
  ]);
});

test('for a config file with excluded comments', (t) => {
  t.deepEqual(
    readConfig('fixtures/.exclude-comments-config').exclude.comments,
    { rb: '#', js: '//' }
  );
});

test('for a full featured config file', (t) => {
  t.deepEqual(readConfig('fixtures/.pythia-config'), {
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
