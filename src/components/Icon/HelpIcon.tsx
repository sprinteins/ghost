import * as React from 'react';
import { Icon } from './Icon';
import url from 'url';
import path from 'path';
const { BrowserWindow, rootDir, isDev, devUrl } = window.bridge;

export class HelpIcon extends React.Component<{}, {}> {
  public render() {
    return (
      <>
        <Icon className="helpIcon" onClick={this.help} src={'./assets/helpIcon.png'} />
      </>
    );
  }

  public help = () => {
    let helpWindow = new BrowserWindow({
      width: 350,
      height: 600,
    });

    const helpUrl = isDev
      ? path.join(devUrl, 'help.html')
      : url.format({
          pathname: path.join(rootDir, '..\\help.html'),
          protocol: 'file:',
          slashes: true,
        });
    helpWindow.loadURL(helpUrl);

    helpWindow.on('closed', () => {
      helpWindow = null;
    });
  }
}
