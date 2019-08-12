import React, { Component } from 'react';
import './style.css';
import { sortDirectory } from '../../modules/utils/utils.js';

class FolderView extends Component {
  maxWindows = 3;

  state = {
    currentDirectory: '.',
    folderWindows: [],
  };

  constructor(props) {
    super(props);
    this.state.folderWindows[0] = this.state.currentDirectory;
  }

  render() {
    const { getDirectory } = window.bridge;
    const { folderWindows } = this.state;

    return (
      <div className="folderViewWrapper">
        {folderWindows.map((item, i) => this.folderView(sortDirectory(getDirectory(item)), i))}
      </div>
    );
  }

  onClickFolderItem = (item, folderWindowNo) => {
    let { folderWindows } = this.state;
    if (item.isDir) {
      if (folderWindows.length < this.maxWindows && folderWindowNo == folderWindows.length - 1) {
        folderWindows.push(`${folderWindows[folderWindows.length - 1]}/${item.name}`);
      } else if (folderWindowNo < folderWindows.length - 1) {
        folderWindows[folderWindowNo + 1] = `${folderWindows[folderWindowNo]}/${item.name}`;
        folderWindows = folderWindows.splice(folderWindowNo + 2);
      } else if (folderWindowNo === this.maxWindows - 1) {
        for (let i = 0; i < folderWindows.length - 1; i++) {
          folderWindows[i] = folderWindows[i + 1];
        }
        folderWindows[folderWindowNo] = `${folderWindows[folderWindowNo - 1]}/${item.name}`;
      }
    }
    this.setState(folderWindows);
  };

  folderView = (elements, folderWindowNo) => (
    <div className="folderView" key={folderWindowNo}>
      {elements
        && elements.map((item, i) => (
          <div
            key={i}
            className={`itemView ${item.isDir ? 'folderItemView' : 'fileItemView'}`}
            onClick={() => this.onClickFolderItem(item, folderWindowNo)}
          >
            {item.name}
          </div>
        ))}
    </div>
  );
}

export default FolderView;
