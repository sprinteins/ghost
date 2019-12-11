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
  console.log(JSON.stringify(fileStatsUnique));
  return fileStatsUnique;
};

const resolveRenaming = (fileStats: IFileStats[], fileNamesMap: Map<string, number>): IFileStats[] => {
  //backwards because the first items should be the newest ones
  const indizesToDelte: number[] = [];
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
        const oldIndex = fileNamesMap.get(oldName); //index undefined if never changed before

        const newName =
          prefix +
          name
            .substring(name.indexOf('=>') + 2)
            .replace('}', '')
            .replace(' ', '');
        const newIndex = fileNamesMap.get(newName);
        console.log(name, newIndex, oldIndex);
        if (oldIndex !== undefined) {
          const oldFile = fileStats[oldIndex];
          if (newIndex !== undefined) {
            const newFile = fileStats[newIndex];
            newFile.additions += oldFile.additions;
            newFile.deletions += oldFile.deletions;
            newFile.timesWorkedOn += oldFile.timesWorkedOn;
            newFile.renamedTimes += oldFile.renamedTimes;
            newFile.renamedTimes++;
            fileStats[newIndex] = newFile;
            indizesToDelte.push(oldIndex); // we wont infos about the old file anymore
            console.log('update', oldName, newName);
          } else {
            const newFile = {
              ...oldFile,
              name: newName,
            };
            newFile.renamedTimes++;
            fileStats[oldIndex] = newFile;
            fileNamesMap.set(newName, oldIndex);
            console.log('replace', oldName, newName);
          }
        } else {
          const newFile: IFileStats = {
            name: newName,
            ...fileStats[i],
          };
          newFile.renamedTimes++;
          fileStats[i] = newFile;
          fileNamesMap.set(newName, i);
          console.log('replace', oldName, newName);
        }
      } else {
        // todo !
        // root rename: License.txt -> License
      }
    }
  }
  //remove every renaming file now. They havent been change since so they are not needed or already counted

  const fileStatsUndifinale: Array<IFileStats | undefined> = [...fileStats];
  for (const id of indizesToDelte) {
    fileStatsUndifinale[id] = undefined;
  }

  const filesWithRenaming = fileStatsUndifinale.filter((item) => {
    return !item || item.name.includes('=>') ? false : true;
  }) as IFileStats[];
  return filesWithRenaming;
};
