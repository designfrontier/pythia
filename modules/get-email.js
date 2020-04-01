module.exports = (emailString) => {
  const matches = emailString.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/
  );
  return matches && matches[0];
};
