import {
    AppBar,
    Box,
    Container,
    Grid,
    ThemeProvider,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import * as React from 'react'
import { ghostTheme } from './theme'


export function PrimaryLayout(props: Props) {

    const {
        slotAppBar: SlotAppBar,
        slotContent: SlotContent,
    } = props

    const classes = useStyles()

    return (
        <ThemeProvider theme={ghostTheme} >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <AppBar position="static">
                        {SlotAppBar}
                    </AppBar>
                </Grid>
                <Grid item xs={12}>
                    {SlotContent}
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

interface Props {
    slotAppBar: React.ReactNode
    slotContent: React.ReactNode
}

function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            appBar: {
                paddingBottom: `${theme.spacing(2)}px`,
            },
        }),
    )
    return styles()
}

