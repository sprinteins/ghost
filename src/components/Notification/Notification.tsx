import * as React from 'react';
import { StyledNotification } from './styled';

interface INotificationState {
  isVisible: boolean;
}
interface INotificationProps {
  isVisible: boolean;
  header?: string;
}

export class Notification extends React.Component<INotificationProps, INotificationState> {
  private timerNumber: NodeJS.Timeout | number = -1;

  constructor(props: INotificationProps) {
    super(props);
    this.state = {
      isVisible: false,
    };
    if (props.isVisible) {
      this.state = { isVisible: true };
    }
  }

  public render() {
    const { isVisible } = this.state;
    if (isVisible && this.timerNumber === -1) {
      this.timerNumber = setTimeout(() => this.setState({ isVisible: false }), 2000);
    }
    if (!isVisible) {
      return <StyledNotification></StyledNotification>;
    }
    return (
      <StyledNotification>
        <article className="message">
          <div className="message-header">
            <p>{this.props.header || ''}</p>
            <button className="delete" aria-label="delete"></button>
          </div>
          <div className="message-body">{this.props.children}</div>
        </article>
      </StyledNotification>
    );
  }
}
