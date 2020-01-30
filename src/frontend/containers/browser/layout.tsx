import { Box, Container, Grid } from '@material-ui/core'

import * as React from 'react'

export function Layout(props: Props) {

    const {
        slotBreadcrumbs: SlotBreadcrumbs,
        slotProgress: SlotProgress,
        slotContent: SlotContent,
    } = props


    return (
        <Container maxWidth="xl">
            <Grid container spacing={3}>
                <Grid item xs={9}>
                    {SlotBreadcrumbs}
                </Grid>
                <Grid item xs={3}>
                    {SlotProgress}
                </Grid>
                <Grid item xs={12}>
                    {SlotContent}
                </Grid>
            </Grid>
        </Container>
    )
}

interface Props {
    slotBreadcrumbs: React.ReactNode
    slotProgress: React.ReactNode
    slotContent: React.ReactNode
}
