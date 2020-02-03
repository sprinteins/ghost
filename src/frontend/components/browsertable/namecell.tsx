import { Typography } from '@material-ui/core'
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined'
import * as React from 'react'
import { BlockType } from '../../../common'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'




export function NameCell(props: Props) {

    const {
        name,
    } = props

    const classes = useStyles()

    const Icon = FolderOrFileIcon(props.type)

    return (
        <React.Fragment>
            <span className={classes.icon}>{Icon}</span>
            <span>{name}</span>
        </React.Fragment>
    )
}

function FolderOrFileIcon(type: BlockType) {
    const map = {
        [BlockType.File]: <InsertDriveFileOutlinedIcon />,
        [BlockType.Folder]: <FolderOpenOutlinedIcon />,
    }

    return map[type]
}

interface Props {
    name: string
    type: BlockType
}



function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            icon: {
                top: '6px',
                position: 'relative',
                marginRight: '5px',
            },
        }),
    )
    return styles()
}

