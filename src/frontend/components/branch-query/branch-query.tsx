import { Box, Button, Grid, TextField } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import * as React from 'react'



export function BranchQuery(props: Props) {

    const [query, setQuery] = React.useState('')

    const {
        onQuery = () => { },
        onChange = () => { },
    } = props

    const sendQuery = () => onQuery(query)
    const inputOnChange = (value: string) => {
        setQuery(value)
        onChange(value)
    }

    const input = <Input onChange={inputOnChange} onEnter={sendQuery} />

    return layout(
        input,
    )

}

interface Props {
    onQuery?: OnQueryHandler
    onChange?: OnChangeHandler
}

type OnQueryHandler = (query: string) => void
type OnChangeHandler = (query: string) => void


function layout(
    input: React.ReactNode,
) {

    const classes = useStyles()

    return (
        <Box>
            <span>{input}</span>
        </Box>
    )
}

function Input(props: InputProps) {

    const {
        onChange = () => { },
        onEnter = () => { },
    } = props

    const onKeyDown = (event: React.KeyboardEvent) => {
        const enterKeyCode = 13
        if (event.keyCode !== enterKeyCode) {
            return
        }

        onEnter()
    }

    return (
        <TextField
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            id="standard-helperText"
            label="Branch Query"
            helperText="bugfix/, feature/, etc..."
        />
    )
}

interface InputProps {
    onChange?: (text: string) => void
    onEnter?: () => void
}



function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            button: {
                marginTop: '10px',
                marginLeft: '20px',
                display: 'inline-block',
            },
        }),
    )
    return styles()
}

