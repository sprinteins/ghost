import React, { Component } from "react";
import log from "../../modules/git";
import "./style.css";
import helpIcon from "../../../assets/helpIcon.png";
import Table from "../../components/Table";
import { sortByAttribute } from "../../utils/sort";
import url from "url";
import path from "path";
const { dialog, BrowserWindow } = window.bridge;

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.openFolderDialog = this.openFolderDialog.bind(this);
    this.logDoneCB = this.logDoneCB.bind(this);
    this.logProgressCB = this.logProgressCB.bind(this);

    this.help = this.help.bind(this);

    this.state = {
      noOfFiles: 0,
      fileStats: []
    };
  }

  openFolderDialog() {
    const queryParameter = document.getElementById("queryParameter").value;
    this.state.noOfFiles = 0;
    const filepath = dialog.showOpenDialog({
      properties: ["openFile", "openDirectory", "multiSelections"]
    });

    if (filepath !== undefined) {
      const givenpath = filepath[0];

      document.body.classList.add("busy-cursor");
      const ele = document.getElementById("loadingscreen");
      ele.classList.add("loadingscreen-active");
      ele.classList.remove("loadingscreen-passive");

      this.setState({ fileStats: {} });

      log(givenpath, this.logDoneCB, this.logProgressCB, queryParameter);
    }
  }

  logDoneCB(fileMap, noOfFiles) {
    this.noOfFiles = noOfFiles;
    const fileStats = this.convertfileMapToArray(fileMap);

    this.changeSorting(fileStats, "commits");
  }

  changeSorting(fileStats, attribute) {
    sortByAttribute(fileStats, attribute);
    this.setState({ fileStats });
  }

  logProgressCB(noOfFiles) {
    this.setState({ noOfFiles });
  }

  convertfileMapToArray(fileMap) {
    const fileStats = [];
    for (const key in fileMap) {
      fileStats.push(fileMap[key]);
    }

    return fileStats;
  }

  help() {
    let helpWindow = new BrowserWindow({
      width: 350,
      height: 600
    });

    const helpUrl = url.format({
      pathname: path.join(__dirname, "help.html"),
      protocol: "file:",
      slashes: true
    });

    helpWindow.loadURL(helpUrl);

    helpWindow.on("closed", () => {
      helpWindow = null;
    });
  }

  render() {
    const { fileStats, noOfFiles } = this.state;

    return (
      <div className="Start">
        <div>
          Query Parameter :
          <input className="gitLogQuery" type="text" name="queryParameter" id="queryParameter" defaultValue="bugfix" />
          <button className="repo-button gitLogQuery" id="repo-button" onClick={this.openFolderDialog.bind(this)} type="button">
            Open Repo
          </button>
          <img src={helpIcon} alt="help_icon" className="gitLogQuery" onClick={this.help.bind(this)} type="button" height="18px" style={{ margin: "-3px" }} />
        </div>
        {noOfFiles > 0 && <div id="noOfFiles">{`Overall number of files with query-parameter-ocassion : ${noOfFiles}`}</div>}
        <div id="tablefield">{fileStats && fileStats.length > 0 && <Table fileStats={fileStats} />}</div>
      </div>
    );
  }
}
