import * as React from 'react';
import { StyledIconWrapper } from './styled';

export class Icon extends React.Component<{ src?: string; onClick?: () => void; className?: string }, {}> {
  public render() {
    return (
      <StyledIconWrapper>
        <img className={this.props.className} onClick={this.props.onClick} src={this.props.src || './assets/ghost_pacman.png'} alt="ghost_icon" />
      </StyledIconWrapper>
    );
  }
}
