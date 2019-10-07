import React, { Component } from 'react';
import gLog from '../../modules/git';
import './style.css';

const { dialog, BrowserWindow, rootDir, isDev, devUrl } = window.bridge;
import url from 'url';
import path from 'path';
import { IFileMapObject } from '../../modules/git/calculations';
import { Loading } from '../../components/Loading/Loading';

interface IStartState {
  fileStats: IFileMapObject[];
  noOfFiles: number;
  loading: boolean;
  orderBy: {
    attribute: string;
    order: string;
  };
}

export default class Start extends Component<{}, IStartState> {
  private sortByCommits: () => void;
  private sortByFile: () => void;
  private sortByDate: () => void;
  private openFolderDialogValue: string = '/';
  private queryValue: string = 'bugfix';
  private fileExtension: string = '*';
  private fileExtensionExclusion: string = '';

  private currentPath: string = path.join(__dirname, '..', '..', '..');
  constructor(props: object) {
    super(props);
    this.sortByCommits = () => this.changeSorting(this.state.fileStats, 'commits');
    this.sortByFile = () => this.changeSorting(this.state.fileStats, 'file');
    this.sortByDate = () => this.changeSorting(this.state.fileStats, 'latestDate');
    this.help = this.help.bind(this);

    this.state = {
      noOfFiles: 0,
      fileStats: [],
      loading: false,
      orderBy: {
        attribute: '',
        order: '',
      },
    };
  }

  public sortByAttribute = (array: object[], attribute: string, order: string) => {
    array.sort((a, b) => {
      if (a[attribute] > b[attribute]) {
        return order === 'asc' ? 1 : -1;
      }
      if (a[attribute] < b[attribute]) {
        return order === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public openFolderDialog = async () => {
    this.setState({ loading: true });
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory', 'multiSelections'],
    });
    if (canceled === true) {
      this.setState({ loading: false });
    }
    if (filePaths !== undefined && canceled !== true) {
      this.currentPath = filePaths[0];
      this.setState({ noOfFiles: 0, fileStats: [] });
      gLog(this.currentPath, this.gLogDoneCB, this.queryValue, this.fileExtension, this.fileExtensionExclusion);
    }
  }

  public gLogDoneCB = (fileMap: object, noOfFiles: number) => {
    this.setState({ noOfFiles, loading: false });
    const fileStats = this.convertfileMapToArray(fileMap);

    this.changeSorting(fileStats, 'commits');
  }

  public convertfileMapToArray = (fileMap: object) => {
    return Object.keys(fileMap).map((key) => fileMap[key]);
  }

  public changeSorting = (fileStats: IFileMapObject[], attribute: string) => {
    // By default, sort by file path
    let { order } = this.state.orderBy;
    this.sortByAttribute(fileStats, 'file', order);
    order = (() => {
      if (this.state.orderBy.attribute === attribute) {
        switch (this.state.orderBy.order) {
          case 'asc':
            return 'desc';
          case 'desc':
            return 'asc';
          default:
            return 'desc';
        }
      } else {
        return 'desc';
      }
    })();

    this.sortByAttribute(fileStats, attribute, order);
    this.setState({
      fileStats,
      orderBy: { attribute, order },
    });
  }

  public help = () => {
    let helpWindow = new BrowserWindow({
      width: 350,
      height: 600,
    });

    console.log(isDev);
    const helpUrl = isDev
      ? url.format({
          pathname: path.join(rootDir, '..\\help.html'),
          protocol: 'file:',
          slashes: true,
        })
      : path.join(devUrl, 'help.html');
    helpWindow.loadURL(helpUrl);

    helpWindow.on('closed', () => {
      helpWindow = null;
    });
  }

  public onQueryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //if keydown on enter reevaluate the query
    if (e.keyCode === 13) {
      if (this.currentPath) {
        gLog(this.currentPath, this.gLogDoneCB, this.queryValue, this.fileExtension, this.fileExtensionExclusion);
      }
    }
  }

  public onFileExtensionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      if (this.currentPath) {
        gLog(this.currentPath, this.gLogDoneCB, this.queryValue, this.fileExtension, this.fileExtensionExclusion);
      }
    }
  }

  public setFileExtensionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.fileExtension = e.target.value;
  }

  public onFileExtensionExclusionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      if (this.currentPath) {
        gLog(this.currentPath, this.gLogDoneCB, this.queryValue, this.fileExtension, this.fileExtensionExclusion);
      }
    }
  }

  public setFileExtensionExclusionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.fileExtensionExclusion = e.target.value;
  }

  public render() {
    if (this.state.loading) {
      return <Loading />;
    }
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
      showNumberOfFiles = <div id="noOfFiles">{`Overall number of files with query-parameter-ocassion : ${this.state.noOfFiles}`}</div>;
    } else {
      showNumberOfFiles = <div> </div>;
    }

    return (
      <div className="Start">
        <div>
          Query parameter:{' '}
          <input
            className="gitLogQuery"
            type="text"
            id="queryParameter"
            name="queryParameter"
            onChange={(e) => (this.queryValue = e.target.value)}
            defaultValue={this.queryValue}
          />{' '}
          file extension(s): &nbsp;
          <input
            placeholder="all"
            className="fileExtensitonInput"
            type="text"
            name="fileExtension"
            id="fileExtension"
            onKeyDown={this.onFileExtensionKeyDown}
            onChange={this.setFileExtensionValue}
          />{' '}
          exclusion(s):{' '}
          <input
            placeholder="disables file extensions!"
            className="fileExtensitonExclusion"
            type="text"
            name="fileExtensionExclusion"
            id="fileExtensionExclusion"
            onKeyDown={this.onFileExtensionExclusionKeyDown}
            onChange={this.setFileExtensionExclusionValue}
          />{' '}
          split by ','
          <button className="repo-button gitLogQuery" id="repo-button" onClick={this.openFolderDialog} type="button">
            Open Repo
          </button>
          <img src={'./assets/helpIcon.png'} alt="help_icon" className="gitLogQuery" onClick={this.help} height="18px" style={{ margin: '-3px' }} />
        </div>
        {showNumberOfFiles}
        <div id="tablefield">{fileTable}</div>;
      </div>
    );
  }
}
