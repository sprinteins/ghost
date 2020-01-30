import * as React from 'react'

import {
    Toolbar,
    Typography,
    Button
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'


export function HeaderBar() {

    const classes = useStyle()

    return (
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
                👻 GHOST
            </Typography>
            <Button variant="contained">Open Git Repo</Button>
        </Toolbar>
    )
}



function useStyle() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                flexGrow: 1,
            },
            menuButton: {
                marginRight: theme.spacing(2),
            },
            title: {
                flexGrow: 1,
            },
        }),
    )
    return styles()
}