import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import * as React from 'react'
import ghostLogo from '../../assets/ghost_logo.png'

export function Init() {

    const classes = useStyles()

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="Browser Table">
                <TableBody>
                    <TableRow key={1}>
                        <TableCell component="td" scope="row" align="center">
                            <Typography variant="h5">
                                Please open a Git repo
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow key={2}>
                        <TableCell component="td" scope="row" align="center">
                            <img className={classes.logo} src={ghostLogo} />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer >
    )
}

function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            logo: {
                width: '20em',
            },
        }),
    )
    return styles()
}

