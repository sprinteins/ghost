import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import FolderIcon from '@material-ui/icons/Folder'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined'
import * as React from 'react'
import { BlockType, log } from '../../../common'

export function NameCell(props: Props) {

    const {
        name,
        type,
        onClick = noopOnCLick,
    } = props

    const classes = useStyles()

    const Icon = folderOrFileIcon(type)
    const wrappedName = wrapFoldersWithOnClick(name, type, onClick, classes.clickable)

    return (
        <React.Fragment>
            <span className={classes.icon}>{Icon}</span>
            {wrappedName}
        </React.Fragment>
    )
}

interface Props {
    name: string
    type: BlockType
    onClick: HandelerOnClick
}

type HandelerOnClick = (folderName: string) => void
function noopOnCLick() { }

function folderOrFileIcon(type: BlockType) {
    const map = {
        [BlockType.File]: <InsertDriveFileOutlinedIcon />,
        [BlockType.Folder]: <FolderIcon />,
    }

    return map[type]
}

function wrapFoldersWithOnClick(
    name: string,
    type: BlockType,
    onClick: HandelerOnClick,
    className: string,
) {
    if (type === BlockType.File) {
        return (<span>{name}</span>)
    }

    return (
        <span className={className} onClick={() => { onClick(name) }}>{name}</span>
    )
}


function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            icon: {
                top: '6px',
                position: 'relative',
                marginRight: '5px',
            },
            clickable: {
                cursor: 'pointer',
            },
        }),
    )
    return styles()
}

