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
    spacing: 4,
    typography: {
        fontSize: 12,
    },
    props: {
        MuiButton: {
            size: 'small',
        },
        MuiFilledInput: {
            margin: 'dense',
        },
        MuiFormControl: {
            margin: 'dense',
        },
        MuiFormHelperText: {
            margin: 'dense',
        },
        MuiIconButton: {
            size: 'small',
        },
        MuiInputBase: {
            margin: 'dense',
        },
        MuiInputLabel: {
            margin: 'dense',
        },
        MuiListItem: {
            dense: true,
        },
        MuiOutlinedInput: {
            margin: 'dense',
        },
        MuiFab: {
            size: 'small',
        },
        MuiTable: {
            size: 'small',
        },
        MuiTextField: {
            margin: 'dense',
        },
        MuiToolbar: {
            variant: 'dense',
        },
    },
})

