import React, { Component } from 'react';
import log from '../../modules/git';
import './style.css';
import helpIcon from '../../../assets/helpIcon.png';

const { dialog, BrowserWindow } = window.bridge;
const url = require('url');
const path = require('path');

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.sortByCommits = _ => this.changeSorting(this.state.fileStats, 'commits');
    this.sortByFile = _ => this.changeSorting(this.state.fileStats, 'file');
    this.sortByDate = _ => this.changeSorting(this.state.fileStats, 'latestDate');
    this.help = this.help.bind(this);
    this.queryValue="bugfix"
    this.currentPath=null;

    this.state = {
      noOfFiles: 0,
      fileStats: [],
    };
  }

  sortByAttribute = (array, attribute) => {
    array.sort((a, b) => {
      if (a[attribute] > b[attribute]) {
        return -1;
      }
      if (a[attribute] < b[attribute]) {
        return 1;
      }
      return 0;
    });
  };

  openFolderDialog = () => {
    const queryParameter = document.getElementById('queryParameter').value;
    this.state.noOfFiles = 0;
    const filepath = dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory', 'multiSelections'],
    });

    if (filepath !== undefined) {
      this.currentPath = filepath[0];

      document.body.classList.add('busy-cursor');
      const ele = document.getElementById('loadingscreen');
      ele.classList.add('loadingscreen-active');
      ele.classList.remove('loadingscreen-passive');

      this.setState({fileStats:{}})
      log(this.currentPath, this.logDoneCB, this.logProgressCB, queryParameter);
    }
  };

  logDoneCB = (fileMap, noOfFiles) => {
    this.noOfFiles = noOfFiles;
    const fileStats = this.convertfileMapToArray(fileMap);

    this.changeSorting(fileStats, 'commits');
  };

  logProgressCB = (noOfFiles) => {
    this.setState({ noOfFiles });
  };

  convertfileMapToArray = (fileMap) => {
    const fileStats = [];
    for (const key in fileMap) {
      fileStats.push(fileMap[key]);
    }

    return fileStats;
  };

  changeSorting = (fileStats, attribute) => {
    this.sortByAttribute(fileStats, attribute);
    this.setState({ fileStats });
  };

  help = () => {
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
    })
  }
  
  onQueryKeyDown(e) {
    //if keydown on enter reevaluate the query
    if (e.keyCode === 13) {
      if(this.currentPath){
        log(this.currentPath, this.logDoneCB, this.logProgressCB, this.queryValue);
      }
    }
  }

  setQueryValue(e){
    this.queryValue= e.target.value;
  }


  render() {
    let fileTable;
    if (this.state.fileStats.length > 0) {
      fileTable = (
        <table className="file-table">
          <thead>
            <tr>
              <td>#</td>
              <td onClick={this.sortByFile}>File</td>
              <td onClick={this.sortByCommits}>Occassions per file</td>
              <td onClick={this.sortByDate}>Date of last change</td>
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
        <div id="noOfFiles">
          {`Overall number of files with query-parameter-ocassion : ${this.state.noOfFiles}`}
        </div>
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
            name="queryParameter" 
            id="queryParameter" 
            defaultValue={this.queryValue} 
            onKeyDown={this.onQueryKeyDown.bind(this)}
            onChange={this.setQueryValue.bind(this)}
             />
          <button
            className="repo-button gitLogQuery"
            id="repo-button"
            onClick={this.openFolderDialog}
            type="button"
          >
            Open Repo
          </button>
          <img
            src={helpIcon}
            alt="help_icon"
            className="gitLogQuery"
            onClick={this.help}
            type="button"
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
