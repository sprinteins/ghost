import * as React from 'react';
import { ToTopButton } from './styled';

export class ToTop extends React.Component<{}, { display: string }> {
  public state = {
    display: 'none',
  };
  public componentDidMount = () => {
    window.addEventListener('scroll', this.scrollFunction);
  };
  public componentWillUnmount = () => {
    window.removeEventListener('scroll', this.scrollFunction);
  };

  public scrollFunction = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      this.setState({ display: 'block' });
    } else {
      this.setState({ display: 'none' });
    }
  };
  public toTheTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  public render() {
    return (
      <div style={{ width: '100%', height: '100px', display: this.state.display }}>
        <ToTopButton onClick={this.toTheTop}>Back to top</ToTopButton>
      </div>
    );
  }
}
