import React, { Component } from 'react';
import {log} from '../../modules/git';
import './style.css';

const electron = window.require('electron');
const dialog = electron.remote.dialog;



export class Start extends Component {
  
  constructor(props) {
    super(props)
    this.openFolderDialog = this.openFolderDialog.bind(this);
    this.logDoneCB = this.logDoneCB.bind(this);
    this.logProgressCB = this.logProgressCB.bind(this);
    this.sortByCommits =  _ => this.changeSorting(this.state.fileStats, "commits")
    this.sortByFile =  _ => this.changeSorting(this.state.fileStats, "file")

    this.state = { 
      noOfFiles:0, 
      status: 0,
      fileStats: [],
      };
  }
  
  render() {
    
    let fileTable;
    if(this.state.fileStats.length > 0){
      fileTable = <table className="file-table">
                    <thead>
                      <tr>
                        <td onClick={this.sortByFile}>File</td>
                        <td onClick={this.sortByCommits}>bug fixes</td>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.fileStats.map(stat => (
                        <tr key={Math.random()}>
                          <td>{stat.file}</td><td>{stat.commits}</td>
                        </tr>
                      ))
                    }
                    </tbody>
                  </table> 
      
    }
    
    return (
      <div className="Start">
        <button class="repo-button" onClick={this.openFolderDialog.bind(this)}>Open Repo</button>
         <div>{this.state.noOfFiles}</div>
         <div>
           
           {fileTable}
           
         </div>
      </div>
    );
  }
  
  
  openFolderDialog(){
    const path = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})[0];
    
    log(path, this.logDoneCB, this.logProgressCB );
    return;
  }
  
  logDoneCB(fileMap, noOfFiles){
    
    let fileStats = this.convertfileMapToArray(fileMap);
    
    this.changeSorting(fileStats, "commits")
    
    console.log(fileStats);
  }
  
  logProgressCB(noOfFiles){
    this.setState({ noOfFiles: noOfFiles });
  }

  convertfileMapToArray(fileMap){
    let fileStats = [];
    for( let key in fileMap){
      fileStats.push(fileMap[key]);
    }
    
    return fileStats;
  }
  
  
  
  changeSorting(fileStats, attribute){
    this.sortByAttribute(fileStats, attribute);
    this.setState({status:1,fileStats});
  }
  
  sortByAttribute(array,attribute){
    array.sort((a,b)=>{
      if(a[attribute] > b[attribute]){
        return -1
      }
      if(a[attribute] < b[attribute]){
        return 1
      }
      return 0;
    });
  }
  
}



