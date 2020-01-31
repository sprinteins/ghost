import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import * as React from 'react'
import { FileBlock } from '../../../common'

export function BrowserTable(props: Props) {
    const classes = useStyles()
    const { blocks, status } = props
    console.log('rendering with status:', status)
    return (
        <TableContainer component={Paper}>
            <Table className={classes.root} size="small" aria-label="Browser Table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Number of Occurrence</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(status === 'ready') && generateRows(blocks)}
                    {(status === 'loading') && generateRowSkeletons(10)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

interface Props {
    blocks: FileBlock[]
    status: Status
}

type Status = 'loading' | 'ready'


function generateRows(blocks: FileBlock[]) {

    return blocks.map((block) => (
        <TableRow key={block.name}>
            <TableCell component="th" scope="row">
                {block.name}
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
            </TableRow>
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


