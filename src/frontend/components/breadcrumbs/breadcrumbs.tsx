import MUIBreadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { Breadcrumb } from './breadcrumb'


export function Breadcrumbs(props: Props) {

    const classes = useStyle()

    const [path, current] = makeBreadcrumbs(props.path)

    return (
        <MUIBreadcrumbs aria-label="breadcrumb">
            {path && generatePathLinks(path, classes.clickable, props.clickHandler)}
            {current && generateCurrentLink(current)}
        </MUIBreadcrumbs>
    )
}

interface Props {
    clickHandler?: HandlerClick
    path?: Item[]
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

function makeBreadcrumbs(items?: Item[]): [Breadcrumb[], Breadcrumb?] {
    if (items === undefined) {
        return [[], undefined]
    }

    const breadcrumbs = items.map((item, index) => {
        return new Breadcrumb(item, items.slice(0, index + 1))
    })

    const currBC = breadcrumbs.splice(-1, 1)

    return [breadcrumbs, currBC[0]]
}


type HandlerClick = (path: string[]) => void
type Item = string

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



function makeClickHandler(clickHandler: HandlerClick = noopClickHandler, path: string[]) {

    return function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        event.preventDefault()
        clickHandler(path)
    }
}

// tslint:disable-next-line: no-empty
function noopClickHandler() { }
