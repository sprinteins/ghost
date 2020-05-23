import { Grid } from '@material-ui/core'
import * as React from 'react'

export function Layout(props: Props) {

    const {
        slotAddButton,
        slotQueryButton,
        slotBranchQueryElements,
    } = props

    return (
        <Grid container spacing={1}>
            {slotBranchQueryElements}
            <Grid item>
                {slotAddButton}
                {slotQueryButton}
            </Grid>
        </Grid >
    )
}

interface Props {
    slotAddButton: React.ReactNode,
    slotQueryButton: React.ReactNode,
    slotBranchQueryElements: React.ReactNode[],
}
