import React, { Component } from 'react';
import gLog from '../../modules/git';
import './styled.tsx';
const { dialog, rootDir } = window.bridge;
import { IFileMapObject } from '../../modules/git/calculations';
import { Loading } from '../../components/Loading/Loading';
import { Table } from '../../components/Table/Table';
import { Search } from '../../components/Search/Search';
import { StyledMaxwidthModal, ModalCardWrapper, CenterContent } from './styled';
import { Notification } from '../../components/Notification/Notification';
import { Options } from '../../components/Options/Options';

interface IStartState {
  fileStats: IFileMapObject[];
  noOfFiles: number;
  loading: boolean;
  openOptions: boolean;
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
      openOptions: false,
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
    this.queryValue = queryValue;
    if (this.currentPath) {
      this.setState({ noOfFiles: 0, loading: true });
      gLog(this.currentPath, this.gLogDoneCB, queryValue, this.fileExtension, this.fileExtensionExclusion);
    }
  }

  public render() {
    /* if (this.state.loading) {
      return ;
    } */

    let showNumberOfFiles;
    if (this.state.noOfFiles) {
      showNumberOfFiles = (
        <Notification header="Files" isVisible={true}>
          We found <b>{this.state.noOfFiles}</b> files
        </Notification>
      );
    } else {
      showNumberOfFiles = <div> </div>;
    }

    return (
      <>
        <div>
          <br />
          <div className="columns">
            <div className="column has-text-centered">
              <a className="button" id="repo-button" onClick={this.openFolderDialog} type="button">
                Open Repo
              </a>
            </div>
            <CenterContent className="column is-flex">
              <Search onSearch={this.onSearch} defaultValue="bugfix" />
            </CenterContent>
            <div className="column has-text-centered">
              <a className="button" onClick={() => this.setState({ openOptions: true })}>
                Options
              </a>
            </div>
          </div>
        </div>
        {showNumberOfFiles}
        <br />
        <br />
        <br />
        <div id="tablefield">
          {this.state.fileStats.length > 0 ? <Table fileStats={this.state.fileStats} /> : this.state.loading ? <Loading /> : null}
        </div>
        {this.state.openOptions && (
          <div className={`model`}>
            <div className="modal-background" />
            <Options onSave={this.setOptions} closeModal={this.closeModal} />
          </div>
        )}
      </>
    );
  }

  public setOptions = (fileExt: string, fileExtExcl: string) => {
    this.fileExtension = fileExt;
    this.fileExtensionExclusion = fileExtExcl;
    if (this.currentPath) {
      gLog(this.currentPath, this.gLogDoneCB, this.queryValue, this.fileExtension, this.fileExtensionExclusion);
    }
    this.closeModal();
  }

  public closeModal = () => this.setState({ openOptions: false });
}
