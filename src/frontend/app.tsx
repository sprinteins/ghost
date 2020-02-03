import * as React from 'react'
import { FileBlock, log } from '../common'
import './App.css'
import { sendOpenRepoRequest } from './common/messenger'
import { handleFileTree } from './common/messenger/handlefiletree'
import { handleProgressUpdate } from './common/messenger/handleprogressupdate'
import { HeaderBar } from './components'
import { Browser } from './containers'
import { Status as BrowserStatus } from './containers/browser/browser'
import { PrimaryLayout } from './layout/primary'

export function App() {

  const [progress, setProgress] = React.useState(0)
  const [fileTree, setFileTree] = React.useState<FileBlock[]>([])

  let browserStatus: BrowserStatus = 'init'

  if (progress === 0) {
    browserStatus = 'init'
  }

  if (progress > 0) {
    browserStatus = 'loading'
  }

  if (fileTree.length > 0 && progress === 100) {
    browserStatus = 'ready'
  }

  handleProgressUpdate(makeOnProgressUpdate(setProgress))
  handleFileTree(makeHandleFileTree(setFileTree))

  return (
    <PrimaryLayout
      slotAppBar={<HeaderBar onOpenFolder={makeOnOpenFolder(setFileTree)} />}
      slotContent={<Browser progress={progress} fileTree={fileTree} status={browserStatus} />}
    />
  )
}

function makeOnOpenFolder(setFileTree: (blocks: FileBlock[]) => void) {
  return function onOpenFolder(folderPaths: string[]) {
    sendOpenRepoRequest(folderPaths[0])
    setFileTree([])
  }
}




function makeOnProgressUpdate(setProgress: (progress: number) => void) {

  return function onProgressUpdate(progress: number) {
    setProgress(progress)

  }

}

function makeHandleFileTree(setFileTree: (blocks: FileBlock[]) => void) {

  return function onFileTreeUpdate(blocks: FileBlock[]) {
    setFileTree(blocks)
  }

}
