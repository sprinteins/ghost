import * as React from 'react';
import { Icon } from '../Icon/Icon';
import { StyledTitle } from './styled';

export class Title extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <StyledTitle className="title">
          <Icon /> Welcome to Ghost
        </StyledTitle>
      </div>
    );
  }
}
