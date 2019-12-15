import { IMergeWithStats } from './parsing';

export interface IFileStats {
  lastChange: Date;
  additions: number;
  deletions: number;
  timesWorkedOn: number;
  name: string;
  renamedTimes: number;
}

export const groupStats = (merges: IMergeWithStats[]): IFileStats[] => {
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
        const newFileStat: IFileStats = {
          ...fileStat,
          additions: fileStat.additions + stat.additions,
          deletions: fileStat.deletions + stat.deletions,
          timesWorkedOn: ++fileStat.timesWorkedOn,
        };
        fileStats[index] = newFileStat;
      }
    }
  }

  const fileStatsUnique = resolveRenaming(fileStats, fileNamesMap);
  return fileStatsUnique;
};

const resolveRenaming = (fileStats: IFileStats[], fileNamesMap: Map<string, number>): IFileStats[] => {
  //backwards because the first items should be the newest ones
  for (let i = fileStats.length - 1; i >= 0; i--) {
    const name = fileStats[i].name;
    if (name && name.includes('=>')) {
      let newName, oldName;
      if (name.includes('{') && name.includes('}')) {
        //deep rename: src/module/{ index.js => index.ts } for example
        const prefix = name.substring(0, name.indexOf('{'));
        oldName =
          name
            .substring(0, name.indexOf('=>'))
            .replace('{', '')
            .replace(' ', '') + name.substr(name.indexOf('}') + 1);

        newName =
          prefix +
          name
            .substring(name.indexOf('=>') + 2)
            .replace('}', '')
            .replace(' ', '');
      } else {
        oldName = name.substring(0, name.indexOf('=>')).replace(' ', '');
        newName = name.substring(name.indexOf('=>') + 2).replace(' ', '');
      }
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
      fileStats.push({ ...newFile });
      fileStats[i].name = '!!!delete!!!';
      /*
      delete that. Maybe better solution -> new boolean?
       Wasn't that easy so -> later ;)
      */
      if (oldIndex >= 0) {
        fileStats[oldIndex].name = '!!!delete!!!';
      }
      if (newIndex >= 0) {
        fileStats[newIndex].name = '!!!delete!!!';
      }
    }
  }

  const filesWithRenaming = fileStats.filter((item) => {
    return item.name.includes('!!!delete!!!') ? false : true;
  }) as IFileStats[];
  return filesWithRenaming;
};
