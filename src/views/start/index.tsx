import React, { Component } from 'react';
import gLog from '../../modules/git';
import './style.css';

const { dialog, BrowserWindow } = window.bridge;
import url from 'url';
import path from 'path';
import { IFileMapObject } from '../../modules/git/calculations';

interface IStartState {
  fileStats: IFileMapObject[];
  noOfFiles: number;
}

export default class Start extends Component<{}, IStartState> {
  public queryParameter: string = 'bugfix';
  private sortByCommits: () => void;
  private sortByFile: () => void;
  private sortByDate: () => void;
  constructor(props: object) {
    super(props);
    this.sortByCommits = () => this.changeSorting(this.state.fileStats, 'commits');
    this.sortByFile = () => this.changeSorting(this.state.fileStats, 'file');
    this.sortByDate = () => this.changeSorting(this.state.fileStats, 'latestDate');
    this.state = {
      noOfFiles: 0,
      fileStats: [],
    };
  }

  public sortByAttribute = (array: object[], attribute: string) => {
    array.sort((a, b) => {
      if (a[attribute] > b[attribute]) {
        return -1;
      }
      if (a[attribute] < b[attribute]) {
        return 1;
      }
      return 0;
    });
  }

  public openFolderDialog = async (queryParameter: string) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory', 'multiSelections'],
    });
    if (filePaths !== undefined && canceled !== true) {
      const givenpath = filePaths[0];
      /*document.body.classList.add("busy-cursor");
      const ele = document.getElementById("loadingscreen");
      ele.classList.add("loadingscreen-active");
      ele.classList.remove("loadingscreen-passive");*/

      this.setState({ noOfFiles: 0, fileStats: [] });

      gLog(givenpath, this.gLogDoneCB, queryParameter);
    }
  }

  public gLogDoneCB = (fileMap: object, noOfFiles: number) => {
    this.setState({ noOfFiles });
    const fileStats = this.convertfileMapToArray(fileMap);

    this.changeSorting(fileStats, 'commits');
  }

  public convertfileMapToArray = (fileMap: object) => {
    return Object.keys(fileMap).map((key) => fileMap[key]);
  }

  public changeSorting = (fileStats: IFileMapObject[], attribute: string) => {
    this.sortByAttribute(fileStats, 'file');
    this.sortByAttribute(fileStats, attribute);
    this.setState({ fileStats });
  }

  public help = () => {
    let helpWindow = new BrowserWindow({
      width: 350,
      height: 600,
    });

    const helpUrl = url.format({
      pathname: path.join(__dirname, 'help.html'),
      protocol: 'file:',
      slashes: true,
    });

    helpWindow.loadURL(helpUrl);

    helpWindow.on('closed', () => {
      helpWindow = null;
    });
  }

  public showLoadingScreen = () => {
    const c = 'TODO';
  }
  public openFolder = () => {
    this.showLoadingScreen();
    this.openFolderDialog(this.queryParameter);
  }

  public render() {
    let fileTable;
    if (this.state.fileStats.length > 0) {
      fileTable = (
        <table className="file-table">
          <thead>
            <tr>
              <td>#</td>
              <td id="sortByFile" onClick={this.sortByFile}>
                File
              </td>
              <td id="sortByCommits" onClick={this.sortByCommits}>
                Occassions per file
              </td>
              <td id="sortByDate" onClick={this.sortByDate}>
                Date of last change
              </td>
            </tr>
          </thead>
          <tbody>
            {this.state.fileStats.map((stat, index) => (
              <tr key={Math.random()} id={`stat${index}${1}`}>
                <td>{index + 1}</td>
                <td>{stat.file}</td>
                <td>{stat.commits}</td>
                <td>{stat.latestDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    let showNumberOfFiles;
    if (this.state.noOfFiles) {
      showNumberOfFiles = (
        <div id="noOfFiles">{`Overall number of files with query-parameter-ocassion : ${this.state.noOfFiles}`}</div>
      );
    } else {
      showNumberOfFiles = <div> </div>;
    }

    return (
      <div className="Start">
        <div>
          Query Parameter :
          <input
            className="gitLogQuery"
            type="text"
            id="queryParameter"
            name="queryParameter"
            onChange={(e) => (this.queryParameter = e.target.value)}
            defaultValue="bugfix"
          />
          <button className="repo-button gitLogQuery" id="repo-button" onClick={this.openFolder} type="button">
            Open Repo
          </button>
          <img
            src={'./assets/helpIcon.png'}
            alt="help_icon"
            className="gitLogQuery"
            onClick={this.help}
            height="18px"
            style={{ margin: '-3px' }}
          />
        </div>
        {showNumberOfFiles}
        <div id="tablefield">{fileTable}</div>
      </div>
    );
  }
}
