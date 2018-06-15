import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Start} from './views/start';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Glow</h1>
        </header>
        
        <Start />
        
      </div>
    );
  }
}

export default App;

