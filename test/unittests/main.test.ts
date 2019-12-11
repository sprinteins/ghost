import { groupStats } from '../../src/modules/git/calculations';
import { IMergeWithStats, parsing } from '../../src/modules/git/parsing';
import assert from 'assert';

describe('Renaming files', () => {
  it('should have one rename - easy rename', () => {
    const merges: IMergeWithStats[] = [
      {
        date: new Date(),
        stats: [{ additions: 0, deletions: 0, name: 'can_opened.jpg => cant_be_opened.png' }],
      },
    ];
    const fileStats = groupStats(merges);
    expect(fileStats).toHaveLength(1);
    expect(fileStats[0].name).toBe('cant_be_opened.png');
    expect(fileStats[0].timesWorkedOn).toBe(1);
    expect(fileStats[0].renamedTimes).toBe(1);
  });
  it('should have one rename - complex rename', () => {
    const merges: IMergeWithStats[] = [
      {
        date: new Date(),
        stats: [{ additions: 0, deletions: 0, name: '{assets => public/assets}/cant_be_opened.png' }],
      },
    ];
    const fileStats = groupStats(merges);
    expect(fileStats).toHaveLength(1);
    expect(fileStats[0].name).toBe('public/assets/cant_be_opened.png');
    expect(fileStats[0].timesWorkedOn).toBe(1);
    expect(fileStats[0].renamedTimes).toBe(1);
  });
  it('should have two renames and one normal', () => {
    const merges: IMergeWithStats[] = [
      {
        date: new Date(Date.now()),
        stats: [{ additions: 5, deletions: 5, name: 'public/{assets => assets/x}/cant_be_opened.png' }],
      },
      {
        date: new Date(Date.now() - 5000),
        stats: [{ additions: 0, deletions: 20, name: '{assets => public/assets}/cant_be_opened.png' }],
      },
      {
        date: new Date(Date.now() - 10000),
        stats: [
          { additions: 10, deletions: 0, name: 'assets/cant_be_opened.png' },
          { additions: 9, deletions: 0, name: 'assets/other.png' },
        ],
      },
    ];
    const fileStats = groupStats(merges);
    const other = fileStats.find((item) => item.name === 'assets/other.png');
    const cantBeOpened = fileStats.find((item) => item.name === 'public/assets/x/cant_be_opened.png');
    expect(fileStats).toHaveLength(2);
    expect(other).toBeTruthy();
    expect(other.additions).toBe(9);
    expect(cantBeOpened).toBeTruthy();
    expect(cantBeOpened.timesWorkedOn).toBe(3);
    expect(cantBeOpened.additions).toBe(15);
    expect(cantBeOpened.deletions).toBe(25);
    expect(cantBeOpened.renamedTimes).toBe(2);
  });
  it('should have three renames and one normal', () => {
    const merges: IMergeWithStats[] = [
      {
        date: new Date(Date.now() + 1),
        stats: [{ additions: 5, deletions: 5, name: 'public/assets/{x => x/y}/cant_be_opened.png' }],
      },
      {
        date: new Date(Date.now()),
        stats: [{ additions: 5, deletions: 5, name: 'public/{assets => assets/x}/cant_be_opened.png' }],
      },
      {
        date: new Date(Date.now() - 5000),
        stats: [{ additions: 0, deletions: 20, name: '{assets => public/assets}/cant_be_opened.png' }],
      },
      {
        date: new Date(Date.now() - 10000),
        stats: [
          { additions: 10, deletions: 0, name: 'assets/cant_be_opened.png' },
          { additions: 9, deletions: 0, name: 'assets/other.png' },
        ],
      },
    ];
    const fileStats = groupStats(merges);
    const other = fileStats.find((item) => item.name === 'assets/other.png');
    const cantBeOpened = fileStats.find((item) => item.name === 'public/assets/x/y/cant_be_opened.png');
    expect(fileStats).toHaveLength(2);
    expect(other).toBeTruthy();
    expect(other.additions).toBe(9);
    expect(cantBeOpened).toBeTruthy();
    expect(cantBeOpened.timesWorkedOn).toBe(4);
    expect(cantBeOpened.additions).toBe(20);
    expect(cantBeOpened.deletions).toBe(30);
    expect(cantBeOpened.renamedTimes).toBe(3);
  });
});

describe('Merging commits', () => {
  it('should have 3 commits', () => {
    const output = parsing(`Wed, 6 Feb 2019 10:15:28 +0100\n
    3	1	Bugfix_2.txt\nWed, 6 Feb 2019 10:04:11 +0100\n
    5	0	Bugfix_2.txt\nWed, 6 Feb 2019 10:00:42 +0100\n
    3	2	Bugfix_1.txt`);
    expect(output).toHaveLength(3);
    const Bugfix2 = output[0];
    const Bugfix21 = output[1];
    const Bugfix1 = output[2];
    expect(Bugfix2.stats).toHaveLength(1);
    expect(Bugfix21.stats).toHaveLength(1);
    expect(Bugfix1.stats).toHaveLength(1);
    expect(Bugfix2.stats[0].additions).toBe(3);
    expect(Bugfix2.stats[0].deletions).toBe(1);
    expect(Bugfix21.stats[0].additions).toBe(5);
    expect(Bugfix21.stats[0].deletions).toBe(0);
    expect(Bugfix1.stats[0].additions).toBe(3);
    expect(Bugfix1.stats[0].deletions).toBe(2);
  });
  it('should have 3 commits. One of them has 2 stats', () => {
    const output = parsing(`Wed, 6 Feb 2019 10:15:28 +0100\n
    3	1	Bugfix_2.txt\n4	4	Bugfix_2.txt\nWed, 6 Feb 2019 10:04:11 +0100\n
    5	0	Bugfix_2.txt\nWed, 6 Feb 2019 10:00:42 +0100\n
    3	2	Bugfix_1.txt`);
    expect(output).toHaveLength(3);
    const Bugfix2 = output[0];
    const Bugfix21 = output[1];
    const Bugfix1 = output[2];
    expect(Bugfix2.stats).toHaveLength(2);
    expect(Bugfix21.stats).toHaveLength(1);
    expect(Bugfix1.stats).toHaveLength(1);
    expect(Bugfix2.stats[0].additions).toBe(3);
    expect(Bugfix2.stats[0].deletions).toBe(1);
    expect(Bugfix2.stats[1].additions).toBe(4);
    expect(Bugfix2.stats[1].deletions).toBe(4);
    expect(Bugfix21.stats[0].additions).toBe(5);
    expect(Bugfix21.stats[0].deletions).toBe(0);
    expect(Bugfix1.stats[0].additions).toBe(3);
    expect(Bugfix1.stats[0].deletions).toBe(2);
  });
});
