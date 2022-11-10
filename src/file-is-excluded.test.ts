import { fileIsExcluded } from './file-is-excluded';

test('should exclude mentioned files', () => {
  expect(
    fileIsExcluded('exclude/me.txt', {
      exclude: { files: ['exclude/me.txt'] },
    })
  ).toBe(true);
  expect(
    fileIsExcluded('include/me.txt', {
      exclude: { files: ['exclude/me.txt'] },
    })
  ).toBe(false);
});

test('should exclude mentioned directories', () => {
  expect(
    fileIsExcluded('exclude/me.txt', {
      exclude: { directories: ['exclude/'] },
    })
  ).toBe(true);
  expect(
    fileIsExcluded('exclude/me.txt', { exclude: { directories: ['exclude'] } })
  ).toBe(true); // trailing slash test
  expect(
    fileIsExcluded('include/me.txt', {
      exclude: { directories: ['exclude/'] },
    })
  ).toBe(false);
});
