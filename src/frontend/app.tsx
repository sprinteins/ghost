import * as React from 'react'
// import logo from './logo.svg';
import './App.css'
import { Breadcrumbs, HeaderBar } from './components'
import { getElectron } from './electron'
import { PrimaryLayout } from './layout/primary'
import { Browser } from './containers'

export function App() {

  return (
    <PrimaryLayout
      slotAppBar={<HeaderBar />}
      slotContent={<Browser />}
    />
  )
}

function sendMessage(...messages: any[]) {
  const { ipcRenderer } = getElectron()
  ipcRenderer.send('asynchronous-message', messages)
}
