import React from 'react';
import './App.css';
import Start from './views/start/index';
import icon from '../assets/ghost_pacman.png';
import FolderView from './views/folder';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">
          <img src={icon} alt="ghost_icon" width="44px" style={{ padding: '10px' }} />
          <span>Welcome to Ghost</span>
        </h1>
      </header>

      <FolderView />
    </div>
  );
}
