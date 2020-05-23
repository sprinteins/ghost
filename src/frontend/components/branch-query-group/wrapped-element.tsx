import { Grid } from '@material-ui/core'
import * as React from 'react'
import { BranchQuery } from '../'
import { CloseButton } from './close-button'

// TODO: rename
export function WrappedElement(props: Props) {

    const {
        withClose = true,
        onChange = () => { },
        onCloseClick = () => { },
    } = props

    return (
        <Grid item>
            <CloseButton show={withClose} onClick={onCloseClick} />
            <BranchQuery onChange={onChange} />
        </Grid >
    )
}

interface Props {
    withClose?: boolean
    onChange?: (queryText: string) => void
    onCloseClick?: () => void
}
