const processFile = require('modules/process-file'),
      fs = require('fs'),
      cp = require('child_process'),
      writeHeader = () => {
        console.log('FORESIGHT!');
        console.log('Looking into the past to save the future...');
        console.log('-------------------------------------------');
      },
      writeFooter = () => {
        console.log('-------------------------------------------');
        console.log('');
      };

writeHeader();
cp.exec('git diff-tree --no-commit-id --name-only -r HEAD', (error, stdout, stderr) => {
  if (error) {
    console.log('Well.... something broke. Bad.');
  }

  // split on lines to get the list of files
  stdout.split('\n').forEach((file) => {
    processFile(file);
  });

  writeFooter();
});

