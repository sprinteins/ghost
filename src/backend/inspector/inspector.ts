import { FileTree } from '../file-tree'
import { CommandBuilder } from '../git/command-builder'
import { FileChanges } from '../git/file-changes'
import { FileMovement } from '../git/file-movement'
import { LineNotParsable, parse } from '../git/parser'
import { exec as ShellExec } from '../shell-exec'


export class Inspector {

    private commandBuilder: CommandBuilder = new CommandBuilder()
    private parse = parse

    constructor(
        private exec: CommandExecutor = ShellExec,
    ) { }

    /**
     * Analyses the given Git repo
     * @param path the absolute path to the git repo
     * @param branchPrefix is to query branch names
     */
    public async analyse(
        path: string,
        progressHandler: HandlerAnalyseProgress = noopHandleAnalyseProgress,
        branchPrefix?: string,
    ): Promise<FileTree> {
        if (branchPrefix) {
            this.commandBuilder.addBranchPrefix(branchPrefix)
        }

        const command = this.commandBuilder.done()
        const result = await this.exec(command, path)
        const lines = result
            .split('\n')

        const noOfLines = lines.length
        let currProgress = 0
        // TODO: maybe rename "occurrence" to "change"
        const trios = lines.map((line, index) => {
            const trio = this.parse(line)
            const progress = Math.round(((index + 1) / noOfLines) * 100)
            const maxProgress = Math.min(progress, 99)
            if (currProgress !== maxProgress) {
                currProgress = maxProgress
                progressHandler(currProgress)
            }
            return trio
        })
        const [changes, movements] = this.makeBuckets(trios)

        const fileTree = new FileTree()
        changes.forEach((change) => fileTree.addFile(change.path, change.line))
        movements.forEach((movement) => fileTree.move(movement.oldPath, movement.newPath, movement.line))

        return fileTree
    }

    private makeBuckets(trios: Trio[]): [FileChanges[], FileMovement[]] {
        const changes: FileChanges[] = []
        const movements: FileMovement[] = []

        trios.forEach((trio) => {
            if (trio instanceof FileChanges) {
                changes.push(trio)
            }
            if (trio instanceof FileMovement) {
                movements.push(trio)
            }
        })

        return [changes, movements]
    }
}

type Trio = FileChanges | FileMovement | LineNotParsable
type HandlerAnalyseProgress = (progress: number) => void

function noopHandleAnalyseProgress() { }

export type CommandExecutor = (cmd: string, path: string) => Promise<string>
