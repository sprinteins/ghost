import React, { Component } from 'react';
import gLog from '../../modules/git';
import './style.css';
const { dialog, rootDir } = window.bridge;
import { IFileMapObject } from '../../modules/git/calculations';
import { Loading } from '../../components/Loading/Loading';
import { Table } from '../../components/Table/Table';
import { Search } from '../../components/Search/Search';

interface IStartState {
  fileStats: IFileMapObject[];
  noOfFiles: number;
  loading: boolean;
}

export default class Start extends Component<{}, IStartState> {
  private queryValue: string = 'bugfix';
  private fileExtension: string = '*';
  private fileExtensionExclusion: string = '';

  private currentPath: string = rootDir + '../../../';
  constructor(props: object) {
    super(props);
    this.state = {
      noOfFiles: 0,
      fileStats: [],
      loading: false,
    };
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
    this.setState({ fileStats });
  }

  public convertfileMapToArray = (fileMap: object) => {
    return Object.keys(fileMap).map((key) => fileMap[key]);
  }

  public onSearch = (queryValue: string) => {
    //if keydown on enter reevaluate the query
    if (this.currentPath) {
      this.setState({ loading: true });
      gLog(this.currentPath, this.gLogDoneCB, queryValue, this.fileExtension, this.fileExtensionExclusion);
    }
  }

  public onFileExtensionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      if (this.currentPath) {
        this.setState({ loading: true });
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
        this.setState({ loading: true });
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

    let showNumberOfFiles;
    if (this.state.noOfFiles) {
      showNumberOfFiles = <div id="noOfFiles">{`Overall number of files with query-parameter-ocassion : ${this.state.noOfFiles}`}</div>;
    } else {
      showNumberOfFiles = <div> </div>;
    }

    return (
      <>
        <div>
          <div className="columns">
            <div className="column" />
            <div className="column">
              <br />
              <Search onSearch={this.onSearch} defaultValue="bugfix" />
            </div>
            <div className="column" />
          </div>
        </div>
        {showNumberOfFiles}
        <div id="tablefield">{this.state.fileStats.length > 0 ? <Table fileStats={this.state.fileStats} /> : null}</div>
      </>
    );
  }
}
/*

              <input
                placeholder="all"
                className="input"
                type="text"
                name="fileExtension"
                id="fileExtension"
                onKeyDown={this.onFileExtensionKeyDown}
                onChange={this.setFileExtensionValue}
              />{' '}
              exclusion(s):{' '}
              <input
                placeholder="disables file extensions!"
                className="input"
                type="text"
                name="fileExtensionExclusion"
                id="fileExtensionExclusion"
                onKeyDown={this.onFileExtensionExclusionKeyDown}
                onChange={this.setFileExtensionExclusionValue}
              />{' '}
              split by ','
              <button className="button" id="repo-button" onClick={this.openFolderDialog} type="button">
                Open Repo
              </button>

              */
