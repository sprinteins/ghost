import { HeaderID } from './headers'

export interface Sorting {
    headerId: HeaderID
    direction: SortingDirection
}

export type SortingDirection = 'asc' | 'desc' | undefined



