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
import * as React from 'react'

export function BrowserTable(props: Props) {
    const classes = useStyles()
    const { blocks } = props

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
                    {generateRows(blocks)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}


function generateRows(blocks: Block[]) {

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



interface Props {
    blocks: Block[]
}

interface Block {
    name: string
    noOfOccurrence: number
}
