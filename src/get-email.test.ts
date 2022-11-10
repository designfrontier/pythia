import { getEmail } from './get-email';

test('should return an email from a string', () => {
  expect(getEmail('daniel@designfrontier.net')).toBe(
    'daniel@designfrontier.net'
  );
  expect(getEmail('This is daniel@ansble.com')).toBe('daniel@ansble.com');
  expect(getEmail('This is daniel.com')).toBe(null);
});
