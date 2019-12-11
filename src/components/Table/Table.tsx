import * as React from 'react';
import { IFileStats } from '../../modules/git/calculations';

interface ITableProps {
  fileStats: IFileStats[];
  id?: string;
}

interface ITableState {
  orderBy: {
    attribute: string;
    order: string;
  };
  fileStats: IFileStats[];
}

export class Table extends React.Component<ITableProps, ITableState> {
  constructor(props: ITableProps) {
    super(props);
    this.sortByAdditions = () => this.changeSorting(this.props.fileStats, 'additions');
    this.sortByDeletions = () => this.changeSorting(this.props.fileStats, 'deletions');
    this.sortByName = () => this.changeSorting(this.props.fileStats, 'name');
    this.sortByDate = () => this.changeSorting(this.props.fileStats, 'lastChange');
    this.state = {
      orderBy: {
        attribute: 'file',
        order: 'desc',
      },
      fileStats: props.fileStats,
    };
    setTimeout(this.sortByName, 10);
  }
  public sortByAdditions = () => {};
  public sortByDeletions = () => {};
  public sortByName = () => {};
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
  };

  public changeSorting = (fileStats: IFileStats[], attribute: string) => {
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
  };

  public componentWillReceiveProps = (nextProps: ITableProps) => {
    if (nextProps.fileStats.length !== this.props.fileStats.length) {
      this.changeSorting(nextProps.fileStats, 'commits');
    }
  };

  public render() {
    const { fileStats } = this.state;
    return (
      <>
        <table className="table is-bordered is-hoverable is-fullwidth fileTable">
          <thead>
            <tr>
              <td>#</td>
              <td id="sortByFile" onClick={this.sortByName}>
                File
              </td>
              <td id="sortByCommits" onClick={this.sortByAdditions}>
                Additions per file
              </td>
              <td id="sortByCommits" onClick={this.sortByDeletions}>
                Deletions per file
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
                <td>{stat.name}</td>
                <td>{stat.additions}</td>
                <td>{stat.deletions}</td>
                <td>{stat.lastChange.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}
