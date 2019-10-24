export interface IMergeWithDate {
  date: Date;
  lines: string[];
}

export interface IStat {
  additions: number;
  deletions: number;
  name: string;
}

export interface IMergeWithStats {
  date: Date;
  stats: IStat[];
}

export function parsing(output: string): IMergeWithStats[] {
  const lines = output.split('\n');
  const merges = splitIntoMergeCommits(lines);
  const mergesWithDate = createMergesWithDate(merges);
  const mergesWithStats = createMergesWithStats(mergesWithDate);
  return mergesWithStats;
}

const splitIntoMergeCommits = (allLines: string[]): string[][] => {
  const mergeCommits: string[][] = [];
  let currentCommit: string[] = [];
  let first = true;
  for (const line of allLines) {
    if (line === '') {
      continue;
    }
    if (!first) {
      if (startsWithDay(line)) {
        mergeCommits.push(currentCommit);
        currentCommit = [];
      }
    } else {
      first = false;
    }
    currentCommit.push(line);
  }
  return mergeCommits;
};

const startsWithDay = (line: string): boolean => {
  return (
    line.startsWith('Mon, ') ||
    line.startsWith('Tue, ') ||
    line.startsWith('Wed, ') ||
    line.startsWith('Thu, ') ||
    line.startsWith('Fri, ') ||
    line.startsWith('Sat, ') ||
    line.startsWith('Sun, ')
  );
};

const createMergesWithDate = (merges: string[][]): IMergeWithDate[] => {
  const mergesWithDate: IMergeWithDate[] = [];
  for (const merge of merges) {
    const mergeWithDate: IMergeWithDate = {
      date: new Date(merge[0]),
      lines: merge.slice(1),
    };
    mergesWithDate.push(mergeWithDate);
  }
  return mergesWithDate;
};

const createMergesWithStats = (merges: IMergeWithDate[]) => {
  const mergesWithStats: IMergeWithStats[] = [];
  for (const merge of merges) {
    const stats: IStat[] = [];
    for (const line of merge.lines) {
      const stat: IStat = {
        additions: 0,
        deletions: 0,
        name: '',
      };
      const splitLine = line.split('\t');
      if (splitLine.length > 3) {
        console.error('Commitline splitted into more then 3 splits');
      }
      if (splitLine[0] !== '-') {
        stat.additions = parseInt(splitLine[0], 10);
      }
      if (splitLine[1] !== '-') {
        stat.deletions = parseInt(splitLine[1], 10);
      }
      stat.name = splitLine[2];
      stats.push(stat);
    }
    mergesWithStats.push({ date: merge.date, stats });
  }
  return mergesWithStats;
};
