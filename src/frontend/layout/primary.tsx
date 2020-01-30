import {
    AppBar,
    Box,
    ThemeProvider,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import * as React from 'react'
import { ghostTheme } from './theme'


export function PrimaryLayout(props: Props) {

    const {
        slotAppBar: SlotAppBar,
        slotContent: SlotContent,
    } = props

    const classes = useStyles()

    return (
        <ThemeProvider theme={ghostTheme} >
            <Box width={1} className={classes.appBar}>
                <AppBar position="static">
                    {SlotAppBar}
                </AppBar>
            </Box>
            <Box>
                {SlotContent}
            </Box>
        </ThemeProvider>
    )
}

interface Props {
    slotAppBar: React.ReactNode
    slotContent: React.ReactNode
}


interface Props {
    slotBreadcrumbs: React.ReactNode
    slotProgress: React.ReactNode
    slotContent: React.ReactNode
}

function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            appBar: {
                paddingBottom: `${theme.spacing(2)}px`,
            },
        }),
    )
    return styles()
}
