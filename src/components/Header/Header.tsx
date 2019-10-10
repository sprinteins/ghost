import * as React from 'react';
import { Title } from '../Title/Title';
import { HelpIcon } from '../Icon/HelpIcon';

export class Header extends React.Component<{}, {}> {
  public render() {
    return (
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <div className="level">
              <div className="level-right">
                <div className="level-item">
                  <Title />
                </div>
              </div>
              <div className="level-left">
                <div className="level-item">
                  <HelpIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
