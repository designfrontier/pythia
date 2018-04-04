const addAuthor = require('./add-author');

module.exports = (details) => {
  const { size, ownedLines, author, file_path } = details;

  // const size = lineParts[0];
  // const ownedLines = lineParts[1];
  // const author = lineParts[2];
  // const file_path = lineParts[3];
  const ownership = (ownedLines / size) * 100;

  if (ownership >= 20) {
    addAuthor(author);
    console.log(`${author} owns: ${ownership.toFixed(2)} percent of ${file_path}`);
  }
};