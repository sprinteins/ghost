import * as React from 'react'

import AccountTreeIcon from '@material-ui/icons/AccountTree'
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'



export function ViewSwitcher(props: Props) {

    const {
        onChange = noopOnChange,
    } = props

    const [selection, setSelection] = React.useState(View.Tree)

    return (
        <ToggleButtonGroup
            value={selection}
            exclusive
            onChange={makeHandleOnChange(setSelection, onChange)}
            aria-label="Views"
        >
            <ToggleButton value={View.Tree} aria-label="left aligned">
                <AccountTreeIcon />
            </ToggleButton>
            <ToggleButton value={View.List} aria-label="centered">
                <FormatListNumberedRtlIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

function makeHandleOnChange(
    setSelection: (newSelection: View) => void,
    onChange: OnChangeFn,
) {
    return function handleOnChange(_: React.MouseEvent<HTMLElement>, newValue: View) {
        setSelection(newValue)
        onChange(newValue)
    }
}

interface Props {
    onChange?: OnChangeFn
}

type OnChangeFn = (view: View) => void
function noopOnChange(view: View) { }

enum View {
    Tree = 'Tree',
    List = 'List',
}
