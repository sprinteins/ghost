const { Application } = require('spectron');
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');
const fakeDialog = require('spectron-fake-dialog');

// process.env.ELECTRON_START_URL = "http://localhost:1234";

describe('Application launch', function() {
  this.timeout(10000);
  beforeEach(function() {
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
    return this.app
      .start()
      .then(() => fakeDialog.mock([{ method: 'showOpenDialog', value: [pwd] }]));
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', function() {
    return this.app.client.getWindowCount().then(count => {
      assert.equal(count, 1);
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      // assert.equal(count, 2)
    });
  });

  it('has "Open Repo" button', async function() {
    await this.app.client.waitForVisible('.repo-button', 5 * 1000);
  });

  it('should recognize the click on the "Open Repo" button"', async function() {
    await this.app.client.waitForVisible('.repo-button', 5 * 1000).click('.repo-button');
  });

  it('should show entries for the mocked repo', async function() {
    await this.app.client.waitForVisible('.repo-button', 5 * 1000).click('.repo-button');
    await this.app.client.waitForVisible('.file-table');
  });


  it('should display the corresponding number of number of files', async function() {
    await this.app.client.waitForVisible('.repo-button', 5 * 1000).click('.repo-button');
    await this.app.client.waitForVisible('.file-table');

    const elementText = await this.app.client.getText('#noOfFiles');

    assert.equal(elementText, 'Overall number of files with query-parameter-ocassion : 3');
  });


  it('should display the corresponding files', async function() {
    await this.app.client.waitForVisible('.repo-button', 5 * 1000).click('.repo-button');
    await this.app.client.waitForVisible('.file-table');

    const element = await this.app.client.getText('#stat01');

    assert.equal(element, '1 Bugfix_2.txt 2 2019-02-06 T10:15:28');
  });
});
