const test = require('ava');
const sinon = require('sinon');
const processFile = require('./process-file');
const fs = require('fs');
const cp = require('child_process');
const utils = require('./check-ownership');

const sandbox = sinon.createSandbox();

test.beforeEach(t => sandbox.restore());

test.cb('calls checkOwnership with the appropriate arguments', t => {
  t.plan(4);

  const blameResult = fs.readFileSync('fixtures/blame.txt', 'utf8');

  const checkOwnershipStub = sandbox.stub(utils, 'checkOwnership');
  const file = 'fixtures/blame.txt';
  sandbox
    .stub(cp, 'exec')
    .withArgs(`git blame -w --show-email HEAD~1 -- ${file}`)
    .yields(undefined, blameResult, undefined);
  const excludeUsers = [];
  const publish = false;
  const currentAuthor = 'doug@example.com';
  const config = { threshold: 42, exclude: { comments: {} } };

  checkOwnershipStub.onCall(0).callsFake((params, givenPublish) => {
    t.deepEqual(params, {
      author: 'alice@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 3,
      size: 4,
      threshold: config.threshold
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
      threshold: config.threshold
    });
    t.is(givenPublish, publish);
    t.end();
  });

  processFile({ file, excludeUsers, publish, currentAuthor, config });
});

test.cb('calls checkOwnership without commented lines', t => {
  const blameResult = fs.readFileSync(
    'fixtures/blame-comment-single-line.txt',
    'utf8'
  );

  const checkOwnershipStub = sandbox.stub(utils, 'checkOwnership');
  const file = 'fixtures/code-comment-single-line.rb';
  sandbox
    .stub(cp, 'exec')
    .withArgs(`git blame -w --show-email HEAD~1 -- ${file}`)
    .yields(undefined, blameResult, undefined);
  const excludeUsers = [];
  const publish = false;
  const currentAuthor = 'doug@example.com';
  const config = {
    threshold: 42,
    exclude: {
      comments: { '.rb': '#' }
    }
  };

  checkOwnershipStub.onCall(0).callsFake((params, givenPublish) => {
    t.deepEqual(params, {
      author: 'alice@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 1,
      size: 1,
      threshold: config.threshold
    });
    t.end();
  });

  processFile({ file, excludeUsers, publish, currentAuthor, config });
});

test.cb('calls checkOwnership with comments and multiple authors', t => {
  t.plan(2);

  const blameResult = fs.readFileSync(
    'fixtures/blame-multiple-comment.txt',
    'utf8'
  );

  const checkOwnershipStub = sandbox.stub(utils, 'checkOwnership');
  const file = 'fixtures/code-comment-single-line.js';
  sandbox
    .stub(cp, 'exec')
    .withArgs(`git blame -w --show-email HEAD~1 -- ${file}`)
    .yields(undefined, blameResult, undefined);
  const excludeUsers = [];
  const publish = false;
  const currentAuthor = 'doug@example.com';
  const config = { threshold: 42, exclude: { comments: { '.js': '//' } } };

  checkOwnershipStub.onCall(0).callsFake((params, givenPublish) => {
    t.deepEqual(params, {
      author: 'alice@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 2,
      size: 3,
      threshold: config.threshold
    });
  });
  checkOwnershipStub.onCall(1).callsFake((params, givenPublish) => {
    t.deepEqual(params, {
      author: 'bob@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 1,
      size: 3,
      threshold: config.threshold
    });
    t.end();
  });

  processFile({ file, excludeUsers, publish, currentAuthor, config });
});

test.cb('calls git blame again if the shas is excluded', t => {
  t.plan(2);

  const blameResult = fs.readFileSync('fixtures/blame.txt', 'utf8');

  const checkOwnershipStub = sandbox.stub(utils, 'checkOwnership');
  const file = 'fixtures/blame.txt';
  sandbox
    .stub(cp, 'exec')
    .withArgs(`git blame -w --show-email HEAD~1 -- ${file}`)
    .yields(undefined, blameResult, undefined);

  const excludeUsers = [];
  const publish = false;
  const currentAuthor = 'doug@example.com';
  const config = {
    threshold: 42,
    exclude: { comments: {}, shas: ['8a83ec04'] }
  };

  const ecstub = sandbox
    .stub(cp, 'execSync')
    .returns(
      Buffer.from(
        '9a93ec03 (<alice@example.com> 2018-04-03 22:10:49 -0600 2) line 3'
      )
    );

  checkOwnershipStub.onCall(0).callsFake((params, givenPublish) => {
    t.deepEqual(params, {
      author: 'alice@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 4,
      size: 4,
      threshold: config.threshold
    });
    t.is(givenPublish, publish);
    t.end();
  });

  processFile({ file, excludeUsers, publish, currentAuthor, config });
});
