import * as React from 'react'
import { FileBlock } from '../../../common'
import { Breadcrumbs, BrowserTable } from '../../components'
import { Layout } from './layout'
import { Progress } from './progress'


export function Browser(props: Props) {

    const path = ['src', 'something', 'index.ts']
    const {
        progress = 0,
        status = 'loading',
        fileTree = [],
    } = props

    return (
        <Layout
            slotBreadcrumbs={<Breadcrumbs path={path} clickHandler={logBreadcrumbClicks} />}
            slotProgress={<Progress progress={progress} />}
            slotContent={<BrowserTable blocks={fileTree} status={status} />}
        />
    )

}

interface Props {
    progress?: number
    status?: Status
    fileTree?: FileBlock[]
}

export type Status = 'loading' | 'ready'

function logBreadcrumbClicks(path: string[]) {
    console.info('You clicked a breadcrumb: ', path)
    // sendMessage("Clicked", path)
}
