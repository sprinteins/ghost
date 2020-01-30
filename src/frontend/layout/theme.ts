import { createMuiTheme } from '@material-ui/core/styles'


export const ghostTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#111',
        },
        secondary: {
            main: '#eee',
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
})

