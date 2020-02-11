
export class CommandBuilder {

    private parameters: string[] = [
        '--reverse',
        '--merges',
        '--numstat',
        '-m',
        '--first-parent',
        'master',
        '--pretty=%cD',
    ]

    public done(): string {
        return `git log ${this.parameters.join(' ')}`
    }

    public addBranchPrefix(prefix: string): CommandBuilder {
        // const branchPrefix = CommandBuilder.normalizeBranchPrefix(prefix)
        const branchPrefixQuery = `--grep=${prefix}`
        this.parameters.push(branchPrefixQuery)

        return this
    }

    // private static normalizeBranchPrefix(branchName: string): string {

    //     const normalizedBranchName = branchName.replace('/', '') + '/'

    //     return normalizedBranchName
    // }


}
