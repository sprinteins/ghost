import { Box, Container, Grid, TextField } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import * as React from 'react'

export function Layout(props: Props) {

    const {
        slotBreadcrumbs,
        slotProgress,
        slotContent,
        slotTools,
        slotViewSwitcher,
    } = props

    const classes = useStyles()


    return (
        <Container maxWidth="xl" className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {slotProgress}
                </Grid>
                <Grid item xs={10}>
                    {slotTools}
                </Grid>
                <Grid item xs={2} >
                    {slotViewSwitcher}
                </Grid>
                <Grid item xs={12}>
                    {slotBreadcrumbs}
                </Grid>

                <Grid item xs={12}>
                    {slotContent}
                </Grid>
            </Grid>
        </Container >
    )
}


interface Props {
    slotBreadcrumbs: React.ReactNode
    slotProgress: React.ReactNode
    slotContent: React.ReactNode
    slotViewSwitcher: React.ReactNode
    slotTools: React.ReactNode[]
}





function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                marginTop: theme.spacing(3),
            },
        }),
    )
    return styles()
}
