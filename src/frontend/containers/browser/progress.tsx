import * as React from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'


export function Progress(props: Props) {

    const { progress = 0 } = props

    return (
        <LinearProgress variant="determinate" value={progress} />
    )
}

interface Props {
    progress: number
}
