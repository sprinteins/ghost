import * as React from 'react';
import { ToTopButton } from './styled';

export class ToTop extends React.Component<{}, {}> {
  state = {
    display: 'none',
  };
  componentDidMount = () => {
    window.addEventListener('scroll', this.scrollFunction);
  };
  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.scrollFunction);
  };

  scrollFunction = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      this.setState({ display: 'block' });
    } else {
      this.setState({ display: 'none' });
    }
  };
  toTheTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100px', display: this.state.display }}>
        <ToTopButton onClick={this.toTheTop}>Back to top</ToTopButton>
      </div>
    );
  }
}
