const test = require('ava');
const fileIsExcluded = require('./file-is-excluded');

test('should exclude mentioned files', t => {
  t.is(
    fileIsExcluded('exclude/me.txt', {
      exclude: { files: ['exclude/me.txt'] }
    }),
    true
  );
  t.is(
    fileIsExcluded('include/me.txt', {
      exclude: { files: ['exclude/me.txt'] }
    }),
    false
  );
});

test('should exclude mentioned directories', t => {
  t.is(
    fileIsExcluded('exclude/me.txt', {
      exclude: { directories: ['exclude/'] }
    }),
    true
  );
  t.is(
    fileIsExcluded('exclude/me.txt', { exclude: { directories: ['exclude'] } }),
    true
  ); // trailing slash test
  t.is(
    fileIsExcluded('include/me.txt', {
      exclude: { directories: ['exclude/'] }
    }),
    false
  );
});
