import React, { Component } from 'react';
import gLog from '../../modules/git';
import './styled.tsx';
const { dialog, rootDir } = window.bridge;
import { IFileMapObject } from '../../modules/git/calculations';
import { Loading } from '../../components/Loading/Loading';
import { Table } from '../../components/Table/Table';
import { Search } from '../../components/Search/Search';
import { StyledMaxwidthModal, ModalCardWrapper } from './styled';
import { Notification } from '../../components/Notification/Notification';

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
            <div className="column has-text-centered">
              <Search onSearch={this.onSearch} defaultValue="bugfix" />
            </div>
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
            <div className="modal-background"></div>
            <ModalCardWrapper>
              <StyledMaxwidthModal className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Einstellungen</p>
                  <button className="delete" aria-label="close" onClick={this.closeModal}></button>
                </header>
                <section className="modal-card-body">{this.getEinstellungen()}</section>
                <footer className="modal-card-foot">
                  <button className="button is-success" onClick={this.closeModal}>
                    Übernehmen
                  </button>
                </footer>
              </StyledMaxwidthModal>
            </ModalCardWrapper>
          </div>
        )}
      </>
    );
  }

  public closeModal = () => this.setState({ openOptions: false });

  public getEinstellungen = () => {
    return (
      <>
        <div className="field">
          <div className="control">
            <label>Include (File-Extension)</label>
            <input
              placeholder="File-Extension eg: js,jsx,ts"
              className="input"
              type="text"
              name="fileExtension"
              id="fileExtension"
              defaultValue={this.fileExtension}
              onChange={this.setFileExtensionValue}
            />
          </div>
        </div>
        <br />
        <div className="field">
          <div className="control">
            <label>Exclude (File-Extension)</label>
            <input
              placeholder="File-Extension eg: js,jsx,ts"
              className="input"
              type="text"
              name="fileExtensionExclusion"
              id="fileExtensionExclusion"
              defaultValue={this.fileExtensionExclusion}
              onChange={this.setFileExtensionExclusionValue}
            />
          </div>
        </div>
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
