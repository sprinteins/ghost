import { Button } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import * as React from 'react'


export function ButtonQuery(props: SearchButtonProps) {

    const {
        onClick = () => { },
    } = props

    return (
        <Button
            onClick={onClick}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SearchIcon />}
        >
            Query
        </Button>
    )
}

interface SearchButtonProps {
    onClick?: () => void
}


