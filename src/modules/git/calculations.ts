import { IMergeWithStats } from './parsing';

export interface IFileMapObject {
  file: string;
  stats: Array<string | number>;
  latestDate: string;
  commits?: number;
}

export function doTheCalculationsOld(newFileMap: IFileMapObject[]): { fileMap: object; finalCount: number } {
  const finalCount: number = newFileMap.length;
  const fileMap: object = {};

  for (let i = 0; i < finalCount; i += 1) {
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

  return { fileMap, finalCount };
}

interface IFileStats {
  lastChange: Date;
  additions: number;
  deletions: number;
  timesWorkedOn: number;
  name: string;
  renamedTimes: number;
}

export const doTheCalculations = (merges: IMergeWithStats[]): IFileStats[] => {
  const fileStats: IFileStats[] = [];
  const fileNamesMap = new Map<string, number>();
  for (const merge of merges) {
    for (const stat of merge.stats) {
      const index = fileNamesMap.get(stat.name);
      if (index === undefined) {
        const newLength = fileStats.push({ ...stat, lastChange: merge.date, timesWorkedOn: 1, renamedTimes: 0 });
        fileNamesMap.set(stat.name, newLength - 1);
      } else {
        const fileStat = fileStats[index];
        //maybe also change date? but i think the first one is the the last date
        const newFileStat: IFileStats = {
          ...fileStat,
          additions: fileStat.additions + stat.additions,
          deletions: fileStat.deletions + stat.deletions,
          timesWorkedOn: fileStat.timesWorkedOn++,
        };
        fileStats[index] = newFileStat;
      }
    }
  }

  const fileStatsUnique = resolveRenaming(fileStats, fileNamesMap);
  //console.log(JSON.stringify(fileStatsUnique));
  return fileStatsUnique;
};

const resolveRenaming = (fileStats: IFileStats[], fileNamesMap: Map<string, number>): IFileStats[] => {
  //backwards because the first items should be the newest ones
  for (let i = fileStats.length - 1; i >= 0; i--) {
    const name = fileStats[i].name;
    if (name.includes('=>')) {
      if (name.includes('{') && name.includes('}')) {
        //deep rename: src/module/{ index.js => index.ts } for example
        const prefix = name.substring(0, name.indexOf('{'));
        const oldName =
          name
            .substring(0, name.indexOf('=>'))
            .replace('{', '')
            .replace(' ', '') + name.substr(name.indexOf('}') + 1);

        const newName =
          prefix +
          name
            .substring(name.indexOf('=>') + 2)
            .replace('}', '')
            .replace(' ', '');
        const oldIndex = fileStats.findIndex((item) => item.name === oldName);
        const newIndex = fileStats.findIndex((item) => item.name === newName);
        const oldFile = fileStats[oldIndex] || {
          additions: 0,
          deletions: 0,
          lastChange: new Date(),
          name: oldName,
          renamedTimes: 0,
          timesWorkedOn: 0,
        };
        const newFile = fileStats[newIndex] || {
          additions: 0,
          deletions: 0,
          lastChange: fileStats[i].lastChange,
          name: newName,
          renamedTimes: 0,
          timesWorkedOn: 0,
        };
        newFile.name = newName;
        newFile.additions += oldFile.additions + fileStats[i].additions;
        newFile.deletions += oldFile.deletions + fileStats[i].deletions;
        newFile.timesWorkedOn += oldFile.timesWorkedOn + fileStats[i].timesWorkedOn;
        newFile.renamedTimes += oldFile.renamedTimes + fileStats[i].renamedTimes;
        newFile.renamedTimes++;
        fileStats.push(newFile);
        fileStats[i].name = '=>'; //delete that
        if (oldIndex >= 0) {
          fileStats[oldIndex].name = '=>';
        }
        if (newIndex >= 0) {
          fileStats[newIndex].name = '=>';
        }
      } else {
        // todo !
        // root rename: License.txt -> License
      }
    }
  }
  const filesWithRenaming = fileStats.filter((item) => {
    return item.name.includes('=>') ? false : true;
  }) as IFileStats[];
  return filesWithRenaming;
};
