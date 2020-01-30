import * as React from 'react'
import { Breadcrumbs, BrowserTable } from '../../components'
import { Layout } from './layout'
import { Progress } from './progress'


export function Browser(props: Props) {

    const path = ['src', 'something', 'index.ts']
    const { progress = 0 } = props

    return (
        <Layout
            slotBreadcrumbs={<Breadcrumbs path={path} clickHandler={logBreadcrumbClicks} />}
            slotProgress={<Progress progress={progress} />}
            slotContent={<BrowserTable blocks={rows} />}
        />
    )

}

interface Props {
    progress?: number
}


function logBreadcrumbClicks(path: string[]) {
    console.info('You clicked a breadcrumb: ', path)
    // sendMessage("Clicked", path)
}

function createData(name: string, noOfOccurrence: number) {
    return { name, noOfOccurrence }
}

const rows = [
    createData('Frozen yoghurt', 159),
    createData('Ice cream sandwich', 237),
    createData('Eclair', 262),
    createData('Cupcake', 305),
    createData('Gingerbread', 356),
]
