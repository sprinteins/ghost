const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

// process.env.ELECTRON_START_URL = "http://localhost:1234";

describe('Application launch', function () {
  this.timeout(10000)
  
  beforeEach(function () {
    this.app = new Application({
      path: electronPath,
      
      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '..')],
      env:{
        "ELECTRON_START_URL": "http://localhost:1234"
      }
    })
    return this.app.start()
  })
  
  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })
  
  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      // assert.equal(count, 2)
    })
  })
  
  it.only('has "Open Repo" button', async function(){
    await this.app.client.waitForVisible('.repo-button',5*1000);
  });
})