import { ViewType } from '../view-type'

export class OpenRepoCommand {
    constructor(
        public folderPath: string,
        public query: string,
        public viewType: ViewType,
    ) { }
}


