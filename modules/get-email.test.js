/* eslint-disable jest/expect-expect, jest/no-test-callback */

const test = require('ava');
const getEmail = require('./get-email');

test('should return an email from a string', (t) => {
  t.is(getEmail('daniel@designfrontier.net'), 'daniel@designfrontier.net');
  t.is(getEmail('This is daniel@ansble.com'), 'daniel@ansble.com');
  t.is(getEmail('This is daniel.com'), null);
});
