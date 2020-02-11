import { FileBlock } from '..'
import { LinkableFolder } from './linkablefolder'

export interface CurrentLocation {
    folders: LinkableFolder[]
    root: string
    blocks: FileBlock[]
}
