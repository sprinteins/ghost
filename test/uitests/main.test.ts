// @ts-ignore
import mocha from 'mocha';
import { Application } from 'spectron';
import assert from 'assert';
import electronPath from 'electron'; // Require Electron from the binaries included in node_modules.
import path from 'path';
import fakeDialog from 'spectron-fake-dialog';
import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
const appPath = path.join(__dirname, '../../../build/backend/bundle.js');

chai.should();
chai.use(chaiAsPromised);

const WAIT_FOR_ELEMENT = 5 * 1000;

describe('Application launch', function() {
  this.timeout(10000);
  beforeEach(function() {
    this.app = new Application({
      path: (electronPath as unknown) as string,
      env: {
        NODE_ENV: 'test',
        PRELOAD_GIT_MOCK_FILE: 'glogExampleData.txt',
      },
      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [appPath],
    });

    // this will mock the repo-selection
    fakeDialog.apply(this.app);
    const pwd = `${process.cwd()}/test/testrepo/git`;
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness;
    return this.app.start().then(() => fakeDialog.mock([{ method: 'showOpenDialog', value: { filePaths: [pwd], canceled: false } }]));
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', async function() {
    return this.app.client.getWindowCount().then((count) => {
      assert.equal(count, 1);
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      // assert.equal(count, 2)
    });
  });

  it('has "Open Repo" button', async function() {
    await this.app.client.waitForVisible('#repo-button', WAIT_FOR_ELEMENT);
  });

  it('should recognize the click on the "Open Repo" button"', async function() {
    await this.app.client.waitForVisible('#repo-button', WAIT_FOR_ELEMENT).click('#repo-button');
  });

  it('should show entries for the mocked repo', async function() {
    await this.app.client.waitForVisible('#repo-button', WAIT_FOR_ELEMENT).click('#repo-button');
    await this.app.client.waitForVisible('.fileTable');
  });

  it('should display the corresponding number of number of files', async function() {
    await this.app.client.waitForVisible('#repo-button', WAIT_FOR_ELEMENT).click('#repo-button');
    await this.app.client.waitForVisible('.fileTable');

    const elementText = await this.app.client.getText('#noOfFiles');

    assert.equal(elementText, 'We found 12 files');
  });

  it('should display the corresponding files', async function() {
    await this.app.client.waitForVisible('#repo-button', WAIT_FOR_ELEMENT).click('#repo-button');
    await this.app.client.waitForVisible('.fileTable');
    const element = await this.app.client.getText('#stat01');

    assert.equal(element, '1 Bugfix_1.txt 1 2019-02-06 T10:15:28');
  });

  // Dont change the config just for one method.
  //Maybe we need a second tslint config for testing
  //tslint:disable-next-line: no-any
  async function prepareOrderTable(client: any) {
    fakeDialog.mock([
      {
        method: 'showOpenDialog',
        value: { filePaths: [`${process.cwd()}/test/testrepo`], canceled: false },
      },
    ]);
    await client.waitForVisible('.queryParameter', WAIT_FOR_ELEMENT).click('.queryParameter');
    await client
      .element('.queryParameter')
      .setValue('')
      .getText('.queryParameter')
      .should.eventually.be.equal('');

    await client.waitForVisible('#repo-button', WAIT_FOR_ELEMENT).click('#repo-button');
    await client.waitForVisible('.fileTable');
    await client.getText('#stat01').should.eventually.be.contain('Bugfix_1.txt');
  }

  it('should order the repos by file descendingly and ascendingly', async function() {
    const { client } = this.app;
    await prepareOrderTable(client);
    await client.click('#sortByFile');
    await client.getText('#stat01').should.eventually.be.contain('Bugfix_7.txt');
    await client.getText('#stat61').should.eventually.be.contain('Bugfix_1.txt');
    await client.click('#sortByFile');
    await client.getText('#stat01').should.eventually.be.contain('Bugfix_1.txt');
    await client.getText('#stat61').should.eventually.be.contain('Bugfix_7.txt');
  });

  it('should order the repos by Commits descendingly and ascendingly', async function() {
    const { client } = this.app;
    await prepareOrderTable(client);
    await client.getText('#stat01').should.eventually.be.contain('Bugfix_1.txt');
    await client.getText('#stat61').should.eventually.be.contain('Bugfix_7.txt');
    await client.click('#sortByCommits');
    await client.getText('#stat01').should.eventually.be.contain('Bugfix_3.txt');
    await client.getText('#stat61').should.eventually.be.contain('Bugfix_6.txt');
  });

  it('should order the repos by Date descendingly and ascendingly', async function() {
    const { client } = this.app;
    await prepareOrderTable(client);
    await client.click('#sortByDate');
    await client.getText('#stat01').should.eventually.be.contain('Bugfix_4.txt');
    await client.getText('#stat61').should.eventually.be.contain('Bugfix_7.txt');
    await client.click('#sortByDate');
    await client.getText('#stat01').should.eventually.be.contain('Bugfix_7.txt');
    await client.getText('#stat61').should.eventually.be.contain('Bugfix_4.txt');
  });
});
