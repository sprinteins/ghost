import * as React from 'react'
import { CurrentLocation, FileBlock, log } from '../common'
import './App.css'
import { handleLocationChange, sendOpenRepoRequest } from './common/messenger'
import { handleProgressUpdate } from './common/messenger/handleprogressupdate'
import { HeaderBar } from './components'
import { Browser } from './containers'
import { Status as BrowserStatus } from './containers/browser/browser'
import { PrimaryLayout } from './layout'

export function App() {

  const [progress, setProgress] = React.useState(0)
  const [location, setLocation] = React.useState<CurrentLocation>({ folders: [], blocks: [], root: '' })
  const [query, setQuery] = React.useState('')
  const [folderPath, setFolderPath] = React.useState<string[]>([])

  const browserStatus = caclBrowserStatus(progress, location.blocks)

  handleProgressUpdate(makeOnProgressUpdate(setProgress))
  handleLocationChange(makeHandleLocationChange(setLocation))

  const openFolder = makeOnOpenFolder(setLocation)

  const onHeaderBarOpenLocation = (newFolderPath: string[]) => {
    setFolderPath(newFolderPath)
    openFolder(newFolderPath, query)
  }

  const onBrowserQuery = (newQuery: string) => {
    setQuery(newQuery)
    openFolder(folderPath, newQuery)
  }

  return (
    <PrimaryLayout
      slotAppBar={<HeaderBar onOpenFolder={onHeaderBarOpenLocation} />}
      slotContent={
        <Browser
          onQuery={onBrowserQuery}
          root={location.root}
          progress={progress}
          fileTree={location.blocks}
          breadcrumbs={location.folders}
          status={browserStatus}
        />
      }
    />
  )
}


// TODO: it is not a good idea to overwrite values
// ifs should not have overlapping they should be mutually exclusive
function caclBrowserStatus(progress: number, blocks: FileBlock[]): BrowserStatus {
  let browserStatus: BrowserStatus = 'init'

  if (progress === 0) {
    browserStatus = 'init'
  }

  if (progress > 0) {
    browserStatus = 'loading'
  }

  if (progress === 100) {
    browserStatus = 'ready'
  }

  return browserStatus
}

function makeOnOpenFolder(setLocation: (currLoc: CurrentLocation) => void) {
  return function onOpenFolder(folderPaths: string[], query: string = '') {
    sendOpenRepoRequest(folderPaths[0], query)
    setLocation({ folders: [], blocks: [], root: '' })
  }
}

function makeOnProgressUpdate(setProgress: (progress: number) => void) {

  return function onProgressUpdate(progress: number) {
    setProgress(progress)
  }
}

function makeHandleLocationChange(setLocation: (currLoc: CurrentLocation) => void) {

  return function onFileTreeUpdate(currLoc: CurrentLocation) {
    setLocation(currLoc)
  }

}

