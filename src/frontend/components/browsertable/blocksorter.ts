import { BlockType, FileBlock } from '../../../common'
import { HeaderID } from './headers'
import { Sorting, SortingDirection } from './sorting'


export function sortBlocks(blocks: FileBlock[], sorting: Sorting): FileBlock[] {

    const weight = calcWeight(sorting.direction)
    const sorter = makeSortingFn(sorting, weight)

    return blocks.sort(sorter)
}


function makeSortingFn(sorting: Sorting, weight: number): SortFn {

    const sortFnMakeMap: { [key: string]: (weight: number) => SortFn } = {
        [HeaderID.Name]: makeSortByName,
        [HeaderID.NoOfOccurrences]: makeSortByOccurrence,
        [HeaderID.None]: makeSortByType,
    }

    const makeSorter = sortFnMakeMap[sorting.headerId]
    return makeSorter(weight)

}

type SortFn = (a: FileBlock, b: FileBlock) => number

function makeSortByName(weight: number): SortFn {

    return (a, b) => {
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()
        if (nameA < nameB) {
            return -1 * weight
        }
        if (nameA > nameB) {
            return 1 * weight
        }

        // names must be equal
        return 0
    }
}

function makeSortByOccurrence(weight: number): SortFn {
    return (a, b) => {
        const occA = a.noOfOccurrence
        const occB = b.noOfOccurrence
        if (occA < occB) {
            return -1 * weight
        }
        if (occA > occB) {
            return 1 * weight
        }

        return 0
    }
}

function makeSortByType(weight: number): SortFn {
    return (a, b) => {
        const typeA = a.type
        const typeB = b.type
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()

        if (typeA === typeB) {
            if (nameA < nameB) {
                return -1 * weight
            }
            if (nameA > nameB) {
                return 1 * weight
            }

            return 0
        }

        if (typeA !== typeB) {
            if (typeA === BlockType.File) {
                return -1 * weight
            }
            if (typeB === BlockType.File) {
                return -1 * weight
            }
        }

        return 0


    }
}



function isSortingNeeded(sorting: Sorting): boolean {
    const noHeader = sorting.headerId === HeaderID.None
    const noSorting = sorting.direction === undefined
    const sortingNeeded = !(noHeader || noSorting)

    return sortingNeeded
}

function calcWeight(direction: SortingDirection): number {
    if (direction === 'desc') {
        return -1
    }

    return 1
}
