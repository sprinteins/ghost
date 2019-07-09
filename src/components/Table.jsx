import React, { Component } from 'react';
import { sortByAttribute } from '../utils/sort';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileStats: props.fileStats,
    };
  }

  changeSorting = (attribute) => {
    sortByAttribute(this.state.fileStats, attribute);
    this.setState({ fileStats: this.state.fileStats });
  };

  render() {
    const { fileStats } = this.state;
    return (
      <div>
        <table className="file-table">
          <thead>
            <tr>
              <td>#</td>
              <td onClick={() => this.changeSorting('file')}>File</td>
              <td onClick={() => this.changeSorting('commits')}>Occassions per file</td>
              <td onClick={() => this.changeSorting('latestDate')}>Date of last change</td>
            </tr>
          </thead>
          <tbody>
            {fileStats.map((stat, index) => (
              <tr key={index} id={`stat${index}${1}`}>
                <td>{index + 1}</td>
                <td>{stat.file}</td>
                <td>{stat.commits}</td>
                <td>{stat.latestDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
