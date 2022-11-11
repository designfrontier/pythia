import * as sinon from 'sinon';
import { processFile } from './process-file';
import * as fs from 'fs';
import * as cp from 'child_process';
import * as utils from './check-ownership';

const sandbox = sinon.createSandbox();

beforeEach(() => sandbox.restore());

test('calls checkOwnership with the appropriate arguments', (done) => {
  expect.assertions(4);

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
    expect(params).toEqual({
      author: 'alice@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 3,
      size: 4,
      threshold: config.threshold,
    });
    expect(givenPublish).toBe(publish);
  });
  checkOwnershipStub.onCall(1).callsFake((params, givenPublish) => {
    expect(params).toEqual({
      author: 'bob@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 1,
      size: 4,
      threshold: config.threshold,
    });
    expect(givenPublish).toBe(publish);
    done();
  });

  processFile({ file, excludeUsers, publish, currentAuthor, config });
});

test('calls checkOwnership without commented lines', (done) => {
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
      comments: { '.rb': '#' },
    },
  };

  checkOwnershipStub.onCall(0).callsFake((params, givenPublish) => {
    expect(params).toEqual({
      author: 'alice@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 1,
      size: 1,
      threshold: config.threshold,
    });
    done();
  });

  processFile({ file, excludeUsers, publish, currentAuthor, config });
});

test('calls checkOwnership with comments and multiple authors', (done) => {
  expect.assertions(2);

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
    expect(params).toEqual({
      author: 'alice@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 2,
      size: 3,
      threshold: config.threshold,
    });
  });
  checkOwnershipStub.onCall(1).callsFake((params, givenPublish) => {
    expect(params).toEqual({
      author: 'bob@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 1,
      size: 3,
      threshold: config.threshold,
    });
    done();
  });

  processFile({ file, excludeUsers, publish, currentAuthor, config });
});

test('calls git blame again if the shas is excluded', (done) => {
  expect.assertions(2);

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
    exclude: { comments: {}, shas: ['8a83ec04'] },
  };

  sandbox
    .stub(cp, 'execSync')
    .returns(
      Buffer.from(
        '9a93ec03 (<alice@example.com> 2018-04-03 22:10:49 -0600 2) line 3'
      )
    );

  checkOwnershipStub.onCall(0).callsFake((params, givenPublish) => {
    expect(params).toEqual({
      author: 'alice@example.com',
      currentAuthor: currentAuthor,
      filePath: file,
      ownedLines: 4,
      size: 4,
      threshold: config.threshold,
    });
    expect(givenPublish).toBe(publish);
    done();
  });

  processFile({ file, excludeUsers, publish, currentAuthor, config });
});
