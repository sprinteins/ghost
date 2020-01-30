import { createMuiTheme } from '@material-ui/core/styles'
import { lightBlue as primaryColor } from '@material-ui/core/colors'


export const theme = createMuiTheme({
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

