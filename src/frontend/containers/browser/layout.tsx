import { Box, Container, Grid, TextField } from '@material-ui/core'

import * as React from 'react'

export function Layout(props: Props) {

    const {
        slotBreadcrumbs,
        slotProgress,
        slotContent,
        slotTools,
    } = props


    return (
        <Container maxWidth="xl">
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    {slotTools}
                </Grid>
                <Grid item xs={3}>
                    {slotProgress}
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
    slotTools: React.ReactNode[]
}
