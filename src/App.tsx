import React from 'react';
import Start from './views/start/index';
import './App.css';
import { Header } from './components/Header/Header';

export default class App extends React.Component {
  public render() {
    return (
      <>
        <Header />
        <Start />
      </>
    );
  }
}
