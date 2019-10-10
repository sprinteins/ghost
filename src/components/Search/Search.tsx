import * as React from 'react';

interface ISearchProps {
  onSearch: (value: string) => void;
  defaultValue?: string;
}

export class Search extends React.Component<ISearchProps, { value: string }> {
  constructor(props: ISearchProps) {
    super(props);
    this.state = {
      value: props.defaultValue || '',
    };
  }

  public onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //if keydown on enter reevaluate the query
    if (e.keyCode === 13) {
      this.props.onSearch(this.state.value);
    }
  }
  public render() {
    const { value } = this.state;
    return (
      <>
        <div className="field has-addons">
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Branch-Prefix"
              onKeyDown={this.onKeyDown}
              onChange={(e) => this.setState({ value: e.target.value })}
              defaultValue={value}
            />
          </div>
          <p className="control">
            <button className="button" onClick={() => this.props.onSearch(this.state.value)}>
              Suchen
            </button>
          </p>
        </div>
      </>
    );
  }
}
