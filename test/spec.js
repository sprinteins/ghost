/* eslint-disable func-names */

import doTheCalculations, { fileMap } from '../src/modules/git/calculations';
import formatting, { newFileMap } from '../src/modules/git/formatting';

const { Application } = require('spectron');
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');
const fakeDialog = require('spectron-fake-dialog');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

chai.should();
chai.use(chaiAsPromised);

const WAIT_FOR_ELEMENT = 5 * 1000;

// process.env.ELECTRON_START_URL = "http://localhost:1234";

describe('Application launch', function () {
  this.timeout(10000);
  beforeEach(function () {
    this.app = new Application({
      path: electronPath,
      env: {
        NODE_ENV: 'test',
      },
      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '..')],
    });

    // this will mock the repo-selection
    fakeDialog.apply(this.app);
    const pwd = `${process.cwd()}/test/testrepo/git`;
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness;
    return this.app
      .start()
      .then(() => fakeDialog.mock([{ method: 'showOpenDialog', value: [pwd] }]));
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then((count) => {
      assert.equal(count, 1);
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      // assert.equal(count, 2)
    });
  });

  it('has "Open Repo" button', async function () {
    await this.app.client.waitForVisible('.repo-button', WAIT_FOR_ELEMENT);
  });

  it('should recognize the click on the "Open Repo" button"', async function () {
    await this.app.client.waitForVisible('.repo-button', WAIT_FOR_ELEMENT).click('.repo-button');
  });

  it('should show entries for the mocked repo', async function () {
    await this.app.client.waitForVisible('.repo-button', WAIT_FOR_ELEMENT).click('.repo-button');
    await this.app.client.waitForVisible('.file-table');
  });

  it('should display the corresponding number of number of files', async function () {
    await this.app.client.waitForVisible('.repo-button', WAIT_FOR_ELEMENT).click('.repo-button');
    await this.app.client.waitForVisible('.file-table');

    const elementText = await this.app.client.getText('#noOfFiles');

    assert.equal(elementText, 'Overall number of files with query-parameter-ocassion : 3');
  });

  it('should display the corresponding files', async function () {
    await this.app.client.waitForVisible('.repo-button', WAIT_FOR_ELEMENT).click('.repo-button');
    await this.app.client.waitForVisible('.file-table');

    const element = await this.app.client.getText('#stat01');

    assert.equal(element, '1 Bugfix_2.txt 2 2019-02-06 T10:15:28');
  });

  async function prepareOrderTable(client) {
    fakeDialog.mock([{ method: 'showOpenDialog', value: [`${process.cwd()}/test/testrepo`] }]);
    await client.waitForVisible('#queryParameter', WAIT_FOR_ELEMENT).click('#queryParameter');
    await client
      .element('#queryParameter')
      .setValue('')
      .getText('#queryParameter')
      .should.eventually.be.equal('');

    await client.waitForVisible('.repo-button', WAIT_FOR_ELEMENT).click('.repo-button');
    await client.waitForVisible('.file-table');
    await client.getText('#stat01').should.eventually.be.contain('test/spec.js');
  }

  it('should order the repos by file once -> biggest on top', async function () {
    const { client } = this.app;
    await prepareOrderTable(client);
    await client.click('#sortByFile');
    await client.getText('#stat01').should.eventually.be.contain('yarn.lock');
  });

  it('should order the repos by Commits once -> biggest on top', async function () {
    const { client } = this.app;
    await prepareOrderTable(client);
    await client.click('#sortByCommits');
    await client.getText('#stat01').should.eventually.be.contain('test/spec.js');
    await client.getText('#stat31').should.eventually.be.contain('src/modules/git/index.js');
  });

  it('should order the repos by Date once -> biggest on top', async function () {
    const { client } = this.app;
    await prepareOrderTable(client);
    await client.click('#sortByDate');
    await client.getText('#stat01').should.eventually.be.contain('test/spec.js');
  });
});

// non UI tests
describe('foramtting tests', () => {
  it('filenames are read correctly and assigned', () => {
    const output = 'Wed, 6 Feb 2019 10:15:28 +0100\n\n3	1	Bugfix_2.txt\nWed, 6 Feb 2019 10:04:11 +0100\n\n5	0	Bugfix_2.txt\nWed, 6 Feb 2019 10:00:42 +0100\n\n3	1	Bugfix_1.txt';
    formatting(output);
    const isValid = newFileMap[0].file;
    assert.equal(isValid, 'Bugfix_2.txt');
    const secondValidation = newFileMap[1].file;
    assert.equal(secondValidation, 'Bugfix_2.txt');
    const thirdValidaiton = newFileMap[2].file;
    assert.equal(thirdValidaiton, 'Bugfix_1.txt');
  });

  it('latestDates are read correctly formatted into the needed date format and assigned', () => {
    const output = 'Wed, 6 Feb 2019 10:15:28 +0100\n\n3	1	Bugfix_2.txt\nWed, 6 Feb 2019 10:04:11 +0100\n\n5	0	Bugfix_2.txt\nWed, 6 Feb 2019 10:00:42 +0100\n\n3	1	Bugfix_1.txt';
    formatting(output);
    const isValid = newFileMap[0].latestDate;
    assert.equal(isValid, '2019-02-06 T10:15:28');
    const secondValidation = newFileMap[1].latestDate;
    assert.equal(secondValidation, '2019-02-06 T10:04:11');
    const thirdValidaiton = newFileMap[2].latestDate;
    assert.equal(thirdValidaiton, '2019-02-06 T10:00:42');
  });

  it('stats are read correctly and assigned', () => {
    const output = 'Wed, 6 Feb 2019 10:15:28 +0100\n\n3	1	Bugfix_2.txt\nWed, 6 Feb 2019 10:04:11 +0100\n\n5	0	Bugfix_2.txt\nWed, 6 Feb 2019 10:00:42 +0100\n\n3	1	Bugfix_1.txt';
    formatting(output);
    const firstObjectAdditions = newFileMap[0].stats[0];
    assert.equal(firstObjectAdditions, 3);
    const firstObjectDeletions = newFileMap[0].stats[1];
    assert.equal(firstObjectDeletions, 1);
    const secondObjectAdditions = newFileMap[1].stats[0];
    assert.equal(secondObjectAdditions, 5);
    const secondObjectDeletions = newFileMap[1].stats[1];
    assert.equal(secondObjectDeletions, 0);
    const thirdObjectAdditions = newFileMap[2].stats[0];
    assert.equal(thirdObjectAdditions, 3);
    const thirdObjectDeletions = newFileMap[2].stats[1];
    assert.equal(thirdObjectDeletions, 1);
  });
});

describe('calculations tests', () => {
  it('amout of additions should be calculated as 8 and 3 and filled into the fileMap', () => {
    const fileMapForCalculations = [{ file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:15:28', stats: [3, 1, 'Bugfix_2.txt'] },
    { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:04:11', stats: [5, 0, 'Bugfix_2.txt'] },
    { file: 'Bugfix_1.txt', latestDate: '2019-02-06 T10:00:42', stats: [3, 1, 'Bugfix_1.txt'] }];
    doTheCalculations(fileMapForCalculations);
    const isValid = fileMap['Bugfix_2.txt'].additions;
    assert.equal(isValid, 8);
    const secondValidation = fileMap['Bugfix_1.txt'].additions;
    assert.equal(secondValidation, 3);
  });

  it('amout of deletions should be calculated as 1 and 1 and filled into the fileMap', () => {
    const fileMapForCalculations = [{ file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:15:28', stats: [3, 1, 'Bugfix_2.txt'] },
    { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:04:11', stats: [5, 0, 'Bugfix_2.txt'] },
    { file: 'Bugfix_1.txt', latestDate: '2019-02-06 T10:00:42', stats: [3, 1, 'Bugfix_1.txt'] }];
    doTheCalculations(fileMapForCalculations);
    const isValid = fileMap['Bugfix_2.txt'].deletions;
    assert.equal(isValid, 1);
    const secondValidation = fileMap['Bugfix_1.txt'].deletions;
    assert.equal(secondValidation, 1);
  });

  it('amout of changes should be calculated as 4 and 9 and filled into the fileMap', () => {
    const fileMapForCalculations = [{ file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:15:28', stats: [3, 1, 'Bugfix_2.txt'] },
    { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:04:11', stats: [5, 0, 'Bugfix_2.txt'] },
    { file: 'Bugfix_1.txt', latestDate: '2019-02-06 T10:00:42', stats: [3, 1, 'Bugfix_1.txt'] }];
    doTheCalculations(fileMapForCalculations);
    const isValid = fileMap['Bugfix_1.txt'].changes;
    assert.equal(isValid, 4);
    const secondValidation = fileMap['Bugfix_2.txt'].changes;
    assert.equal(secondValidation, 9);
  });

  it('amout of commits should be calculated as 2 and 1 and filled into the fileMap', () => {
    const fileMapForCalculations = [{ file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:15:28', stats: [3, 1, 'Bugfix_2.txt'] },
    { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:04:11', stats: [5, 0, 'Bugfix_2.txt'] },
    { file: 'Bugfix_1.txt', latestDate: '2019-02-06 T10:00:42', stats: [3, 1, 'Bugfix_1.txt'] }];
    doTheCalculations(fileMapForCalculations);
    const isValid = fileMap['Bugfix_2.txt'].commits;
    assert.equal(isValid, 2);
    const secondValidation = fileMap['Bugfix_1.txt'].commits;
    assert.equal(secondValidation, 1);
  });
});
