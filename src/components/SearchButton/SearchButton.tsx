import * as React from 'react';

export class SearchButton extends React.Component<{}, {}> {
  public render() {
    return (
      <>
        <div className="field has-addons">
          <p className="control">
            <input className="input" type="text" placeholder="Branch-Prefix" />
          </p>
          <p className="control">
            <button className="button">Suchen</button>
          </p>
        </div>
      </>
    );
  }
}
