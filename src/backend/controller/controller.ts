import { FileTree } from '../file-tree'
import { CommandBuilder } from '../git/command-builder'
import { FileChanges } from '../git/file-changes'
import { FileMovement } from '../git/file-movement'
import { LineNotParsable, parse } from '../git/parser'
import { exec as ShellExec } from '../shell-exec'


// I don't have a better name yet.
export class Controller {

    private commandBuilder: CommandBuilder = new CommandBuilder()
    private parse = parse

    constructor(
        private exec: CommandExecutor = ShellExec,
    ) { }

    public async analyse(path: string, branchPrefix?: string): Promise<FileTree> {
        if (branchPrefix) {
            this.commandBuilder.addBranchPrefix(branchPrefix)
        }

        const command = this.commandBuilder.done()
        const result = await this.exec(command, path)
        const lines = result.split('\n')

        // TODO: maybe rename "occurrence" to "change"
        const trios = lines.map(this.parse)
        const [changes, movements] = this.makeBuckets(trios)

        const fileTree = new FileTree()
        changes.forEach((change) => fileTree.addFile(change.path))
        movements.forEach((movement) => fileTree.move(movement.oldPath, movement.newPath))

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

export type CommandExecutor = (cmd: string, path: string) => Promise<string>
