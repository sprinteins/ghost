const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
const sinon = require('sinon')
//const {openFolderDialog} = require('./../src/views/start')

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
  
  it('has "Open Repo" button', async function(){
    await this.app.client.waitForVisible('.repo-button',5*1000);
  });

  it.only('should recognize the click on the "Open Repo" button"', async function(){
    /*


    var repofunction = {method: log("/Users/Heiko/Projekte/sprinteins/Ghost3/test/testrepo_ghost", this.logDoneCB, this.logProgressCB )};
    var fakemethode = sinon.fake();
    sinon.replace(this.app, 'openFolderDialog', fakemethode);
    */
   
    stubfunction=this.app.client.log("/Users/Heiko/Projekte/sprinteins/Ghost3/test/testrepo_ghost", this.logDoneCB, this.logProgressCB )
    
    var stub = sinon.stub(this.app.client, 'openFolderDialog').callsFake(stubfunction);

    await this.app.client.waitForVisible('.repo-button',5*1000);
    return this.app.client.element('.repo-button').click();



    //return this.app.client.element('.repo-button').click();
    //assert.equal(fakemethode.count, 1)
    /*
    await this.app.client.waitForVisible('openFolderDialog',5*1000);
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 2)});
    */

    //log("/Users/Heiko/Projekte/sprinteins/Ghost3/test/testrepo_ghost", this.logDoneCB, this.logProgressCB );


  });
})