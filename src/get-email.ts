import type { Maybe } from '../types/maybe';

export const getEmail = (emailString: string): Maybe<string> => {
  const matches = emailString.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/
  );
  return matches?.length ? matches[0] : null;
};
