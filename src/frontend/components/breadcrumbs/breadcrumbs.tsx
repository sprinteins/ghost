import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { log } from '../../../common'
import { Breadcrumb } from './breadcrumb'


export function Breadcrumbs(props: Props) {

    const classes = useStyle()
    const [path, current] = splitBreadcrumbs(props.breadcrumbs)

    const {
        root,
        onClick,
    } = props

    return (
        <MUIBreadcrumbs aria-label="breadcrumb">
            {root && generateRootLink(root, classes.clickable, onClick)}
            {path && generatePathLinks(path, classes.clickable, onClick)}
            {current && generateCurrentLink(current)}
        </MUIBreadcrumbs>
    )
}

interface Props {
    onClick?: HandlerClick
    breadcrumbs?: Breadcrumb[]
    root: string,
}

type HandlerClick = (path: string) => void

function generateRootLink(
    root: string,
    className: string,
    clickHandler?: HandlerClick,
): React.ReactNode {

    return (
        <Link
            key={`${root}_0`}
            color="inherit"
            className={className}
            onClick={makeClickHandler(clickHandler, '')}>

            {root}

        </Link>
    )
}


function generatePathLinks(
    bcs: Breadcrumb[],
    className: string,
    clickHandler?: HandlerClick,
): React.ReactNode[] {

    return bcs.map((bc, index) => (
        <Link
            key={bc.name + index}
            color="inherit"
            className={className}
            onClick={makeClickHandler(clickHandler, bc.path)}>

            {bc.name}

        </Link>
    ))
}

function generateCurrentLink(
    bc: Breadcrumb,
): React.ReactNode {
    return <Typography color="textPrimary">{bc.name}</Typography>
}

function splitBreadcrumbs(bcs?: Breadcrumb[]): [Breadcrumb[], Breadcrumb?] {

    const currBC = bcs.splice(-1, 1)

    return [bcs, currBC[0]]
}



function useStyle() {
    const styles = makeStyles((theme: Theme) =>
        createStyles({
            clickable: {
                cursor: 'pointer',
            },
        }),
    )
    return styles()
}



function makeClickHandler(clickHandler: HandlerClick = noopClickHandler, path: string) {

    return function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        event.preventDefault()
        clickHandler(path)
    }
}

function noopClickHandler() { }
