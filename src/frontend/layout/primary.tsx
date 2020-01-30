import * as React from 'react'
import {
    Box,
    AppBar,
    ThemeProvider,
} from '@material-ui/core'
import { theme } from './theme'


export function PrimaryLayout(props: Props) {

    const {
        slotAppBar: SlotAppBar,
        slotContent: SlotContent,
    } = props

    return (
        <ThemeProvider theme={theme} >
            <Box width={1}>
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
