import * as React from 'react';
import { IFileMapObject } from '../../modules/git/calculations';

interface ITableProps {
  fileStats: IFileMapObject[];
}

interface ITableState {
  orderBy: {
    attribute: string;
    order: string;
  };
  fileStats: IFileMapObject[];
}

export class Table extends React.Component<ITableProps, ITableState> {
  constructor(props: ITableProps) {
    super(props);
    this.sortByCommits = () => this.changeSorting(this.props.fileStats, 'commits');
    this.sortByFile = () => this.changeSorting(this.props.fileStats, 'file');
    this.sortByDate = () => this.changeSorting(this.props.fileStats, 'latestDate');
    this.state = {
      orderBy: {
        attribute: 'file',
        order: 'desc',
      },
      fileStats: props.fileStats,
    };
    setTimeout(this.sortByFile, 10);
  }
  public sortByCommits = () => {};
  public sortByFile = () => {};
  public sortByDate = () => {};

  public sortByAttribute = (array: object[], attribute: string, order: string) => {
    array.sort((a, b) => {
      if (a[attribute] > b[attribute]) {
        return order === 'asc' ? 1 : -1;
      }
      if (a[attribute] < b[attribute]) {
        return order === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeSorting = (fileStats: IFileMapObject[], attribute: string) => {
    // By default, sort by file path
    const { orderBy } = this.state;
    let { order } = orderBy;
    this.sortByAttribute(fileStats, 'file', order);
    order = (() => {
      if (orderBy.attribute === attribute) {
        switch (orderBy.order) {
          case 'asc':
            return 'desc';
          case 'desc':
            return 'asc';
          default:
            return 'desc';
        }
      } else {
        return 'desc';
      }
    })();

    this.sortByAttribute(fileStats, attribute, order);
    this.setState({
      fileStats,
      orderBy: { attribute, order },
    });
  }

  public componentWillReceiveProps = (nextProps: ITableProps) => {
    if (nextProps.fileStats.length !== this.props.fileStats.length) {
      this.changeSorting(nextProps.fileStats, 'commits');
    }
  }

  public render() {
    const { fileStats } = this.state;
    return (
      <>
        <table className="table is-bordered is-hoverable is-fullwidth">
          <thead>
            <tr>
              <td>#</td>
              <td id="sortByFile" onClick={this.sortByFile}>
                File
              </td>
              <td id="sortByCommits" onClick={this.sortByCommits}>
                Occassions per file
              </td>
              <td id="sortByDate" onClick={this.sortByDate}>
                Date of last change
              </td>
            </tr>
          </thead>
          <tbody>
            {fileStats.map((stat, index) => (
              <tr key={Math.random()} id={`stat${index}${1}`}>
                <td>{index + 1}</td>
                <td>{stat.file}</td>
                <td>{stat.commits}</td>
                <td>{stat.latestDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}
