module.exports = (publishFile) => {
  try {
    fs.statSync(publishFile).isFile();
  } catch (e) {
    console.log(`Your publish script (${publishFile}) does not seem to exist: ${e}`);
    process.exit(1);
  }

  return true;
}