import { FileChanges } from "./file-changes";
import { FileMovement } from "./file-movement";
import { defaultTo } from "lodash"

export function parse(line: string): FileChanges | FileMovement | LineNotParsable {

    if (!isLineParsable(line)) {
        return new LineNotParsable()
    }

    const components = createComponents(line)
    if (isFileMovement(components)) {
        return createFileMovement(components)
    }

    return createFileChanges(components);
}

function createComponents(line: string): Components {
    return line.split("\t");
}

function isLineParsable(line: string): boolean {
    const comps = createComponents(line)

    return comps.length === 3
}

function createFileMovement(components: Components): FileMovement {
    const path = components[2];
    const regex = /(.*){(.*)}(.*)/g;
    const matches = defaultTo(regex.exec(path), ["", "", ""])

    const pathBeforeChangedPart = matches[1]
    const pathAfterChangedPart = matches[3]

    const changedPart = matches[2]
    const pathChange = changedPart.split(" => ")
    const oldPathPart = pathChange[0]
    const newPathPart = pathChange[1]

    const oldPath = `${pathBeforeChangedPart}${oldPathPart}${pathAfterChangedPart}`
    const newPath = `${pathBeforeChangedPart}${newPathPart}${pathAfterChangedPart}`

    return new FileMovement(oldPath, newPath);
}

function createFileChanges(components: Components): FileChanges {
    const path = components[2];

    return new FileChanges(path)
}

function isFileMovement(components: Components): boolean {

    return (
        components.length === 3 &&
        components[0] === "-" &&
        components[1] === "-" &&
        components[2].indexOf("=>") >= 0
    )

}
type Components = string[]

export class LineNotParsable { }
