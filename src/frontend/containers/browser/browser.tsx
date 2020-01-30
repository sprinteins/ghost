import * as React from 'react'
import { Breadcrumbs, BrowserTable } from '../../components'
import { Layout } from './layout'


export function Browser() {

    const path = ['src', 'something', 'index.ts']

    return (
        <Layout
            slotBreadcrumbs={<Breadcrumbs path={path} clickHandler={logBreadcrumbClicks} />}
            slotProgress={<div>40%</div>}
            slotContent={<BrowserTable blocks={rows} />}
        />
    )

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
