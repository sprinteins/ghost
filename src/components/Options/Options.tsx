import * as React from 'react';
import { ModalCardWrapper, StyledMaxwidthModal } from '../../views/start/styled';

interface IOptions {
  closeModal: () => void;
  onSave: (fileExt: string, fileExtExcl: string) => void;
}

export class Options extends React.Component<IOptions, {}> {
  public fileExtension = '*';
  public fileExtensionExclusion = '';

  public setFileExtensionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.fileExtension = e.target.value;
  }

  public setFileExtensionExclusionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.fileExtensionExclusion = e.target.value;
  }

  public render() {
    return (
      <ModalCardWrapper>
        <StyledMaxwidthModal className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Einstellungen</p>
            <button className="delete" aria-label="close" onClick={this.props.closeModal} />
          </header>
          <section className="modal-card-body">
            <div className="field">
              <div className="control">
                <label>Include (File-Extension)</label>
                <input
                  placeholder="File-Extension eg: js,jsx,ts"
                  className="input"
                  type="text"
                  name="fileExtension"
                  id="fileExtension"
                  onChange={this.setFileExtensionValue}
                  defaultValue={this.fileExtension}
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
                  onChange={this.setFileExtensionExclusionValue}
                  defaultValue={this.fileExtensionExclusion}
                />
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={() => this.props.onSave(this.fileExtension, this.fileExtensionExclusion)}>
              Übernehmen
            </button>
          </footer>
        </StyledMaxwidthModal>
      </ModalCardWrapper>
    );
  }
}
