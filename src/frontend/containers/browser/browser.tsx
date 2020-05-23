import * as React from 'react'
import { FileBlock, log, ViewType } from '../../../common'
import { sendChangeLocationRequest } from '../../common/messenger/locationchangerequest'
import { Breadcrumbs, BrowserTable, ViewSwitcher } from '../../components'
import { Breadcrumb } from '../../components/breadcrumbs/breadcrumb'
import { Layout } from './layout'
import { Progress } from './progress'
import { BranchQuery } from '../../components'


export function Browser(props: Props) {

    const {
        progress = 0,
        status = 'init',
        fileTree = [],
        breadcrumbs = [],
        root = '',
        onQuery = () => { },
        onViewChange = () => { },
    } = props

    const basePath = extractBasePath(breadcrumbs)

    const onFolderClick = makeOnFolderClick(basePath)

    const branchQuery = <BranchQuery key="branch-query" onQuery={onQuery} />
    const viewSwitcher = <ViewSwitcher onChange={onViewChange} />

    return (
        <Layout
            slotBreadcrumbs={<Breadcrumbs root={root} breadcrumbs={breadcrumbs} onClick={logBreadcrumbClicks} />}
            slotProgress={<Progress progress={progress} />}
            slotViewSwitcher={viewSwitcher}
            slotContent={
                <BrowserTable
                    blocks={fileTree}
                    status={status}
                    onFolderClick={onFolderClick}
                />
            }
            slotTools={[branchQuery]}
        />
    )

}

interface Props {
    progress?: number
    status?: Status
    fileTree?: FileBlock[]
    breadcrumbs?: Breadcrumb[]
    root?: string
    onQuery?: (query: string) => void
    onViewChange?: (viewType: ViewType) => void
}


function makeOnFolderClick(basePath: string) {
    return function onFolderClick(folderName: string) {
        let newCWD = folderName
        if (basePath !== '') {
            newCWD = `${basePath}/${folderName}`
        }

        // TODO: maybe propagate to App
        sendChangeLocationRequest(newCWD)
    }
}

function extractBasePath(bcs: Breadcrumb[]): string {
    const last = bcs[bcs.length - 1]
    if (!last) {
        return ''
    }

    return last.path

}

export type Status = 'loading' | 'ready' | 'init'

function logBreadcrumbClicks(path: string) {
    console.info('You clicked a breadcrumb: ', path)
    sendChangeLocationRequest(path)
    // sendMessage("Clicked", path)
}
