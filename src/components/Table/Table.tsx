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
    this.state = {
      orderBy: {
        attribute: 'file',
        order: 'desc',
      },
      fileStats: props.fileStats,
    };
    setTimeout(() => this.changeSorting('name'), 10);
  }

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

  public changeSorting = (attribute: string) => {
    const fileStats = this.props.fileStats;
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
      this.changeSorting('commits');
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
              <td id="sortByFile" onClick={() => this.changeSorting('name')}>
                File
              </td>
              <td id="sortByAddition" onClick={() => this.changeSorting('additions')}>
                Additions per file
              </td>
              <td id="sortByDeletion" onClick={() => this.changeSorting('deletions')}>
                Deletions per file
              </td>
              <td id="sortByWorkedOn" onClick={() => this.changeSorting('timesWorkedOn')}>
                Times worked on
              </td>
              <td id="sortByRenamed" onClick={() => this.changeSorting('renamedTimes')}>
                Times renamed
              </td>
              <td id="sortByDate" onClick={() => this.changeSorting('lastChange')}>
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
                <td>{stat.timesWorkedOn}</td>
                <td>{stat.renamedTimes}</td>
                <td>{stat.lastChange.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}
