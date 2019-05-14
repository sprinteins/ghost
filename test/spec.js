const { Application } = require('spectron');
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');
const {
  afterEach,
  describe,
  beforeEach,
  it,
} = require('mocha');

// process.env.ELECTRON_START_URL = "http://localhost:1234";

describe('Application launch', () => {
  let app;

  beforeEach(async () => {
    app = new Application({
      path: electronPath,

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '..')],
      env: {
        ELECTRON_START_URL: 'http://localhost:1234',
      },
    });
    await app.start();
  });

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it('shows an initial window', async () => {
    const count = await app.client.getWindowCount();
    assert.equal(count, 1);
    // Please note that getWindowCount() will return 2 if `dev tools` are opened.
    // assert.equal(count, 2)
  });

  it('has "Open Repo" button', async () => {
    await app.client.waitForVisible('.repo-button', 5 * 1000);
  });

});
