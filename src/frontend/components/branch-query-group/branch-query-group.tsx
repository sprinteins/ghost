import { Fab, Grid, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import * as React from 'react'
import { QueryButton } from './query-button'
import { WrappedElement } from './wrapped-element'


// TODO: down
interface QueryState { [key: string]: string }
interface QueryElementState { [key: string]: React.ReactNode }

export function BranchQueryGroup(props: Props) {

    const {
        onQuery = () => { },
    } = props

    // States cannot be merged because
    // the elements' inital state need the queries setter function
    const [
        queries,
        setQueries,
    ] = React.useState<QueryState>({})

    const [
        queryElements,
        setQueryElements, ,
    ] = React.useState<QueryElementState>(genInitQueryElemntState(setQueries))

    return (
        <Grid container spacing={1}>
            {childrenObjectToKeyedArray(queryElements)}
            <Grid item>
                <IconButton
                    onClick={makeAddQueryElement(setQueryElements, setQueries)}
                    size="medium"
                    color="secondary"
                    aria-label="add"
                >
                    <AddIcon />
                </IconButton>
                <QueryButton onClick={makeHandleOnClick(onQuery, queries)} />
            </Grid>
        </Grid >
    )
}

interface Props {
    onQuery?: OnQueryFn
}

type OnQueryFn = (queries: string[]) => void

function makeHandleOnClick(
    onQuery: OnQueryFn,
    queryState: QueryState,
) {
    return function handleOnClick() {
        const queries = Object.values(queryState)
        onQuery(queries)
    }
}

function childrenObjectToKeyedArray(children: QueryElementState): React.ReactNode[] {
    return Object
        .keys(children)
        .map((key) => (<React.Fragment key={key}>{children[key]}</React.Fragment>))
}

function genInitQueryElemntState(setQueries: SetQueriesFn): QueryElementState {
    const id = String(Date.now())
    return ({
        [id]: (<WrappedElement
            withClose={false}
            onChange={makeOnChangeByID(id, setQueries)}
        />),
    })
}

// Dispatch<SetStateAction<S>>
function makeAddQueryElement(
    setQueryElements: SetQueryElementFn,
    setQueries: SetQueriesFn,
) {
    return function addQueryElement() {

        setQueryElements((prevState) => {
            const id = makeId()
            const newQueryElements = { ...prevState }
            newQueryElements[id] = (
                <WrappedElement
                    onCloseClick={makeRemoveQueryElementById(id, setQueryElements, setQueries)}
                    onChange={makeOnChangeByID(id, setQueries)}
                />
            )
            return newQueryElements
        })

    }
}
type SetQueryElementFn = React.Dispatch<React.SetStateAction<QueryElementState>>

function makeRemoveQueryElementById(
    id: string,
    setQueryElements: SetQueryElementFn,
    setQueries: SetQueriesFn,
) {
    return function removeQueryElement() {
        setQueryElements((prevState) => {
            const newQueryElements = { ...prevState }
            delete newQueryElements[id]
            return newQueryElements
        })

        setQueries((prevState) => {
            const newQueries = { ...prevState }
            delete newQueries[id]
            return newQueries
        })
    }
}

function makeOnChangeByID(
    id: string,
    setQueries: SetQueriesFn,
) {
    return function onChangeById(queryText: string) {

        setQueries((prevState) => {
            const newQueries = { ...prevState }
            newQueries[id] = queryText
            setQueries(newQueries)
            return newQueries
        })

    }

}
type SetQueriesFn = React.Dispatch<React.SetStateAction<QueryState>>

function makeId(): string {
    return String(Date.now())
}
