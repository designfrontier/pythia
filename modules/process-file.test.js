const test = require('ava');
const sinon = require('sinon');
const processFile = require('./process-file');
const fs = require('fs');
const cp = require('child_process');
const utils = require('./check-ownership');

test.cb('calls checkOwnership with the appropriate arguments', t => {
  t.plan(4)

  const sandbox = sinon.createSandbox();
  const blameResult = fs.readFileSync('fixtures/blame.txt', 'utf8');

  const checkOwnershipStub = sandbox.stub(utils, 'checkOwnership');
  const file = 'fixtures/blame.txt';
  sandbox.stub(cp, 'exec').withArgs(`git blame -w --show-email HEAD~1 -- ${file}`).yields(undefined, blameResult, undefined);
  const excludeUsers = [];
  const publish = false;
  const currentAuthor = 'doug@example.com';
  const config = { threshold: 42 };

  checkOwnershipStub.onCall(0).callsFake((params, givenPublish) => {
    t.deepEqual(params, {
      author: 'alice@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 3,
      size: 4,
      threshold: config.threshold,
    });
    t.is(givenPublish, publish);
  });
  checkOwnershipStub.onCall(1).callsFake((params, givenPublish) => {
    t.deepEqual(params, {
      author: 'bob@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 1,
      size: 4,
      threshold: config.threshold,
    });
    t.is(givenPublish, publish);
    t.end();
  });

  processFile({ file, excludeUsers, publish, currentAuthor, config });
});
