import * as React from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'


export function Progress(props: Props) {

    const { progress = 0 } = props
    const classes = useStyles()

    let showOrHide = classes.hide

    if (progress > 0 && progress < 100) {
        showOrHide = classes.show
    }

    return (
        // <LinearProgress variant="determinate" className={showOrHide} value={progress} />
        <LinearProgress className={showOrHide} value={progress} />
    )
}

interface Props {
    progress: number
}


function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({

            hide: {
                opacity: 0,
                transition: 'opacity 0.5s linear',
            },
            show: {
                opacity: 1,
                transition: 'opacity 0.5s linear',
            },


        }),
    )

    return styles()
}


/*

.myElement {
	opacity: 0.5;
	transition-property: opacity;
}


.myElement:hover {
	opacity: 1;
}

*/
