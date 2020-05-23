import { IconButton } from '@material-ui/core'
import * as React from 'react'

import CloseIcon from '@material-ui/icons/Close'

export function ButtonClose(props: Props) {

    const {
        show = true,
        onClick = () => { },
    } = props



    if (!show) {
        return null
    }

    return (
        <IconButton
            onClick={onClick}
            size="medium"
            color="secondary"
            aria-label="remove"
        >
            <CloseIcon />
        </IconButton>
    )
}

interface Props {
    show?: boolean
    onClick?: () => void
}
