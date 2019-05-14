const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const fakeDialog = require('spectron-fake-dialog');

// process.env.ELECTRON_START_URL = "http://localhost:1234";

describe('Application launch', function () {
  this.timeout(0)
  
  beforeEach(function () {
    this.app = new Application({
      path: electronPath,

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '..')],
      env:{
        "ELECTRON_START_URL": "http://localhost:1234"
      },
    });

    //this will mock the repo-selection
    fakeDialog.apply(this.app)
    const pwd = process.cwd()+'/test/testrepo';
    return this.app.start().then(()=> 
    fakeDialog.mock([{method: 'showOpenDialog', value: [pwd]}])

    )
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
  
  it('has "Open Repo" button', async function(){
    await this.app.client.waitForVisible('.repo-button',5*1000);
  });

  it('should recognize the click on the "Open Repo" button"', async function(){
    await this.app.client.waitForVisible('.repo-button',5*1000)
    .then(()=> this.app.client.click('.repo-button')
  )});
  
  it('should show entries for the mocked repo', async function (){
    await this.app.client.waitForVisible('.repo-button',5*1000)
    .then(()=> this.app.client.click('.repo-button'))
    await this.app.client.waitForVisible('.file-table')
  })
})
