import * as React from 'react'

import AccountTreeIcon from '@material-ui/icons/AccountTree'
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { ViewType } from '../../../common'



export function ViewSwitcher(props: Props) {

    const {
        onChange = noopOnChange,
    } = props

    const [selection, setSelection] = React.useState(ViewType.Tree)

    return (
        <ToggleButtonGroup
            value={selection}
            exclusive
            onChange={makeHandleOnChange(setSelection, onChange)}
            aria-label="Views"
        >
            <ToggleButton value={ViewType.Tree} aria-label="left aligned">
                <AccountTreeIcon />
            </ToggleButton>
            <ToggleButton value={ViewType.List} aria-label="centered">
                <FormatListNumberedRtlIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

function makeHandleOnChange(
    setSelection: (newSelection: ViewType) => void,
    onChange: OnChangeFn,
) {
    return function handleOnChange(_: React.MouseEvent<HTMLElement>, newValue: ViewType) {
        setSelection(newValue)
        onChange(newValue)
    }
}

interface Props {
    onChange?: OnChangeFn
}

type OnChangeFn = (view: ViewType) => void
function noopOnChange(view: ViewType) { }


