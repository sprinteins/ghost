
export class CommandBuilder {
    private parameters: string[] = [
        "--merges",
        "--numstat",
        "-m",
        "--first-parent",
        "master",
        "--pretty=%cD",
    ]

    done(): string {
        return `git log ${this.parameters.join(" ")}`
    }

    addBranchPrefix(prefix: string): CommandBuilder {
        const branchPrefix = CommandBuilder.normalizeBranchPrefix(prefix)
        const branchPrefixQuery = `--grep=${branchPrefix}`;
        this.parameters.push(branchPrefixQuery);

        return this;
    }


    private static normalizeBranchPrefix(branchName: string): string {

        const normalizedBranchName = branchName.replace("/", "") + "/"

        return normalizedBranchName;
    }

}