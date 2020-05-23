import { IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import * as React from 'react'

export function ButtonAdd(props: Props) {

    const { onClick } = props

    return (
        <IconButton
            onClick={onClick}
            size="medium"
            color="secondary"
            aria-label="add"
        >
            <AddIcon />
        </IconButton>
    )
}

interface Props {
    onClick: () => void
}
