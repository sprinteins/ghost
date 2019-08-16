import React from 'react';
import './App.css';
import Start from './views/start/index';

export default class App extends React.Component {
  state = {};
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            <img src={'./assets/ghost_pacman.png'} alt="ghost_icon" width="44px" style={{ padding: '10px' }} />
            <span>Welcome to Ghost</span>
          </h1>
        </header>

        <Start />
      </div>
    );
  }
}
