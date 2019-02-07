import React, { Component } from 'react';
import log from '../../modules/git';
import './style.css';

const electron = window.require('electron');
const { dialog } = electron.remote;

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.openFolderDialog = this.openFolderDialog.bind(this);
    this.logDoneCB = this.logDoneCB.bind(this);
    this.logProgressCB = this.logProgressCB.bind(this);
    this.sortByCommits = _ => this.changeSorting(this.state.fileStats, 'commits');
    this.sortByFile = _ => this.changeSorting(this.state.fileStats, 'file');

    this.state = {
      noOfFiles: 0,
      status: 0,
      fileStats: [],
    };
  }

  sortByAttribute(array, attribute) {
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

  openFolderDialog() {
    const path = dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory', 'multiSelections'],
    })[0];

    log(path, this.logDoneCB, this.logProgressCB);
  }

  logDoneCB(fileMap, noOfFiles) {
    this.noOfFiles = noOfFiles;
    const fileStats = this.convertfileMapToArray(fileMap);

    this.changeSorting(fileStats, 'commits');

    console.log(fileStats);
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

  changeSorting(fileStats, attribute) {
    this.sortByAttribute(fileStats, attribute);
    this.setState({ fileStats });
  }

  render() {
    let fileTable;
    if (this.state.fileStats.length > 0) {
      fileTable = (
        <table className="file-table">
          <thead>
            <tr>
              <td onClick={this.sortByFile}>File</td>
              <td onClick={this.sortByCommits}>bug fixes</td>
            </tr>
          </thead>
          <tbody>
            {this.state.fileStats.map(stat => (
              <tr key={Math.random()}>
                <td>{stat.file}</td>
                <td>{stat.commits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <div className="Start">
        <button className="repo-button" onClick={this.openFolderDialog.bind(this)} type="button">
          Open Repo
        </button>
        <div>{this.state.noOfFiles}</div>
        <div>{fileTable}</div>
      </div>
    );
  }
}
