import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import * as React from 'react'
import { useState } from 'react'
import { FileBlock, log } from '../../../common'
import { sortBlocks } from './blocksorter'
import { HeaderID } from './headers'
import { Init } from './init'
import { NameCell } from './namecell'
import { Sorting, SortingDirection } from './sorting'

export function BrowserTable(props: Props) {

    const classes = useStyles()
    const { blocks, status } = props
    const [sorting, setSorting] = useState<Sorting>({ headerId: HeaderID.None, direction: undefined })

    if (status === 'init') {
        return (<Init />)
    }

    const headerClickName = makeHeaderOnClick(HeaderID.Name, sorting, setSorting)
    const headerClickOcc = makeHeaderOnClick(HeaderID.NoOfOccurrences, sorting, setSorting)

    const sortedBlocks = sortBlocks(blocks, sorting)

    return (
        <TableContainer component={Paper}>
            <Table className={classes.root} size="small" aria-label="Browser Table">
                <TableHead>
                    <TableRow>
                        <TableCell sortDirection={sorting.direction}>
                            <TableSortLabel
                                active={sorting.headerId === HeaderID.Name}
                                direction={sorting.direction}
                                onClick={headerClickName}
                            >
                                Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell
                            align="right"
                            sortDirection={sorting.direction}
                        >
                            <TableSortLabel
                                active={sorting.headerId === HeaderID.NoOfOccurrences}
                                direction={sorting.direction}
                                onClick={headerClickOcc}
                            >
                                Number of Occurrence
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(status === 'ready') && generateRows(sortedBlocks)}
                    {(status === 'loading') && generateRowSkeletons(10)}
                </TableBody>
            </Table>
        </TableContainer >
    )
}

interface Props {
    blocks: FileBlock[]
    status: Status
}

type Status = 'loading' | 'ready' | 'init'


function makeHeaderOnClick(
    newHeaderId: HeaderID,
    currSort: Sorting,
    setSorting: (sorting: Sorting) => void,
) {
    return function onHeaderClick() {
        const newSorting = determineSorting(currSort, newHeaderId)

        setSorting(newSorting)

    }
}

function determineSorting(currSort: Sorting, headerId: HeaderID): Sorting {
    const sortingSM: { [key: string]: SortingDirection } = {
        asc: undefined,
        desc: 'asc',
        undefined: 'desc',
    }

    if (headerId !== currSort.headerId) {
        return {
            direction: 'desc',
            headerId,
        }
    }

    const direction: SortingDirection = sortingSM[currSort.direction]
    let newHeaderId = headerId

    if (direction === undefined) {
        newHeaderId = HeaderID.None
    }

    return {
        direction,
        headerId: newHeaderId,
    }


}

function generateRows(blocks: FileBlock[]) {

    return blocks.map((block) => (
        <TableRow hover key={block.name}>
            <TableCell component="td" scope="row">
                <NameCell
                    name={block.name}
                    type={block.type}
                />
            </TableCell>
            <TableCell align="right">
                {block.noOfOccurrence}
            </TableCell>
        </TableRow>
    ))
}

function generateRowSkeletons(no: number): React.ReactNode[] {
    const rows: React.ReactNode[] = []
    for (let i = 0; i < no; i++) {
        rows.push(
            <TableRow key={i}>
                <TableCell component="th" scope="row">
                    <Skeleton />
                </TableCell>
                <TableCell align="right">
                    <Skeleton />
                </TableCell>
            </TableRow>,
        )
    }

    return rows
}


function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                minWidth: 650,
            },
        }),
    )
    return styles()
}


