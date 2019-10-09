export let fileMap = {};
export let finalcount = 0;

export interface IFileMapObject {
  file: string;
  stats: Array<string | number>;
  latestDate: string;
  commits?: number;
}

export default function doTheCalculations(newFileMap: IFileMapObject[]) {
  finalcount = newFileMap.length;
  fileMap = {};

  for (let i = 0; i < finalcount; i += 1) {
    const { file } = newFileMap[i];
    if (!fileMap[file]) {
      fileMap[file] = {
        file,
        additions: +newFileMap[i].stats[0],
        deletions: +newFileMap[i].stats[1],
        changes: +newFileMap[i].stats[0] + +newFileMap[i].stats[1],
        commits: 1,
        latestDate: newFileMap[i].latestDate,
      };
    } else {
      // no comparison of the dates, because the first appearance should be the newest one
      fileMap[file].additions += +newFileMap[i].stats[0];
      fileMap[file].deletions += +newFileMap[i].stats[1];
      fileMap[file].changes += +newFileMap[i].stats[0] + +newFileMap[i].stats[1];
      fileMap[file].commits += 1;
    }
  }
}
