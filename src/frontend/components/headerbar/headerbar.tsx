import * as React from 'react'

import {
    Button,
    Fab,
    Toolbar,
    Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { log } from '../../../common'
import { getElectron } from '../../common'

export function HeaderBar(props: Props) {

    const classes = useStyles()

    const {
        onOpenFolder = noopOnOpenFolder,
    } = props

    return (
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
                👻 GHOST
            </Typography>
            <Fab
                size="medium"
                variant="extended"
                color="secondary"
                aria-label="edit"
                onClick={makeOpenDialog(onOpenFolder)}
            >
                <FolderOpenIcon />Open Git Repo
            </Fab>
        </Toolbar>
    )
}

interface Props {
    onOpenFolder?: HandlerOnOpenFolder
}

type HandlerOnOpenFolder = (folderPaths: string[]) => void
function noopOnOpenFolder() { }

function makeOpenDialog(onOpenFolder: HandlerOnOpenFolder) {

    return function openDialog() {
        const { dialog } = getElectron().remote
        dialog.showOpenDialog({ properties: ['openDirectory'] })
            .then((result) => {
                if (result.canceled) {
                    return
                }
                onOpenFolder(result.filePaths)

            }).catch((err) => {
                log.error(err)
            })
    }

}



function useStyles() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                flexGrow: 1,
            },

            menuButton: {
                marginRight: theme.spacing(2),
            },
            title: {
                flexGrow: 1,
            },
        }),
    )
    return styles()
}
