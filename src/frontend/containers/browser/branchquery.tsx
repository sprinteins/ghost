import { Box, Button, Grid, TextField } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import * as React from 'react'
import { log } from '../../../common'


export function BranchQuery(props: Props) {

    const [query, setQuery] = React.useState('')

    const {
        onQuery = () => { },
    } = props

    const sendQuery = () => onQuery(query)

    const button = <SearchButton onClick={sendQuery} />
    const input = <Input onChange={setQuery} onEnter={sendQuery} />

    return layout(
        input,
        button,
    )

}

interface Props {
    onQuery?: HandlerOnQuery
}

type HandlerOnQuery = (query: string) => void


function layout(
    input: React.ReactNode,
    button: React.ReactNode,
) {

    const classes = useStyles()

    return (
        <Box>
            <span>{input}</span>
            <span className={classes.button}>{button}</span>
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

function SearchButton(props: SearchButtonProps) {

    const {
        onClick = () => { },
    } = props

    return (
        <Button
            onClick={onClick}
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<SearchIcon />}
        >
            Query
      </Button>
    )
}

interface SearchButtonProps {
    onClick: () => void
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

