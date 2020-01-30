import * as React from 'react'
import './App.css'
import { sendOpenRepoRequest } from './common/messenger'
import { handleProgressUpdate } from './common/messenger/handleprogressupdate'
import { HeaderBar } from './components'
import { Browser } from './containers'
import { PrimaryLayout } from './layout/primary'

export function App() {

  const [progress, setProgress] = React.useState(0)

  handleProgressUpdate(makeOnProgressUpdate(setProgress))

  return (
    <PrimaryLayout
      slotAppBar={<HeaderBar onOpenFolder={onOpenFolder} />}
      slotContent={<Browser progress={progress} />}
    />
  )
}

function onOpenFolder(folderPaths: string[]) {
  console.log('opening', folderPaths)
  sendOpenRepoRequest(folderPaths[0])
}


function makeOnProgressUpdate(setProgress: (progress: number) => void) {

  return function onProgressUpdate(progress: number) {
    console.log('progress:', progress)
    setProgress(progress)

  }

}
