import { doTheCalculations } from '../../src/modules/git/calculations';
import { IMergeWithStats } from '../../src/modules/git/parsing';
import assert from 'assert';

describe('Renaming files', () => {
  it('should have one rename', () => {
    const merges: IMergeWithStats[] = [
      {
        date: new Date(),
        stats: [{ additions: 0, deletions: 0, name: '{assets => public/assets}/cant_be_opened.png' }],
      },
    ];
    const fileStats = doTheCalculations(merges);
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
    const fileStats = doTheCalculations(merges);
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
    const fileStats = doTheCalculations(merges);
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

// non UI tests
/*
describe('formatting tests', () => {
  it('filenames are read correctly and assigned', () => {
    const output = `Wed, 6 Feb 2019 10:15:28 +0100\n
      3	1	Bugfix_2.txt\nWed, 6 Feb 2019 10:04:11 +0100\n
      5	0	Bugfix_2.txt\nWed, 6 Feb 2019 10:00:42 +0100\n
      3	1	Bugfix_1.txt`;
    formatting(output);
    const isValid = newFileMap[0].file;
    assert.equal(isValid, 'Bugfix_2.txt');
    const secondValidation = newFileMap[1].file;
    assert.equal(secondValidation, 'Bugfix_2.txt');
    const thirdValidaiton = newFileMap[2].file;
    assert.equal(thirdValidaiton, 'Bugfix_1.txt');
  });

  it('latestDates are read correctly formatted into the needed date format and assigned', () => {
    const output = `Wed, 6 Feb 2019 10:15:28 +0100\n
        3	1	Bugfix_2.txt\nWed, 6 Feb 2019 10:04:11 +0100\n
        5	0	Bugfix_2.txt\nWed, 6 Feb 2019 10:00:42 +0100\n
        3	1	Bugfix_1.txt`;
    formatting(output);
    const isValid = newFileMap[0].latestDate;
    assert.equal(isValid, '2019-02-06 T10:15:28');
    const secondValidation = newFileMap[1].latestDate;
    assert.equal(secondValidation, '2019-02-06 T10:04:11');
    const thirdValidaiton = newFileMap[2].latestDate;
    assert.equal(thirdValidaiton, '2019-02-06 T10:00:42');
  });

  it('stats are read correctly and assigned', () => {
    const output = `Wed, 6 Feb 2019 10:15:28 +0100\n
      3	1	Bugfix_2.txt\nWed, 6 Feb 2019 10:04:11 +0100\n
      5	0	Bugfix_2.txt\nWed, 6 Feb 2019 10:00:42 +0100\n
      3	1	Bugfix_1.txt`;
    formatting(output);
    const firstObjectAdditions = newFileMap[0].stats[0];
    assert.equal(firstObjectAdditions, 3);
    const firstObjectDeletions = newFileMap[0].stats[1];
    assert.equal(firstObjectDeletions, 1);
    const secondObjectAdditions = newFileMap[1].stats[0];
    assert.equal(secondObjectAdditions, 5);
    const secondObjectDeletions = newFileMap[1].stats[1];
    assert.equal(secondObjectDeletions, 0);
    const thirdObjectAdditions = newFileMap[2].stats[0];
    assert.equal(thirdObjectAdditions, 3);
    const thirdObjectDeletions = newFileMap[2].stats[1];
    assert.equal(thirdObjectDeletions, 1);
  });
});

describe('calculations tests', () => {
  it('amout of additions should be calculated as 8 and 3 and filled into the fileMap', () => {
    const fileMapForCalculations = [
      { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:15:28', stats: [3, 1, 'Bugfix_2.txt'] },
      { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:04:11', stats: [5, 0, 'Bugfix_2.txt'] },
      { file: 'Bugfix_1.txt', latestDate: '2019-02-06 T10:00:42', stats: [3, 1, 'Bugfix_1.txt'] },
    ];
    doTheCalculations(fileMapForCalculations);
    const isValid = fileMap['Bugfix_2.txt'].additions;
    assert.equal(isValid, 8);
    const secondValidation = fileMap['Bugfix_1.txt'].additions;
    assert.equal(secondValidation, 3);
  });

  it('amout of deletions should be calculated as 1 and 1 and filled into the fileMap', () => {
    const fileMapForCalculations = [
      { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:15:28', stats: [3, 1, 'Bugfix_2.txt'] },
      { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:04:11', stats: [5, 0, 'Bugfix_2.txt'] },
      { file: 'Bugfix_1.txt', latestDate: '2019-02-06 T10:00:42', stats: [3, 1, 'Bugfix_1.txt'] },
    ];
    doTheCalculations(fileMapForCalculations);
    const isValid = fileMap['Bugfix_2.txt'].deletions;
    assert.equal(isValid, 1);
    const secondValidation = fileMap['Bugfix_1.txt'].deletions;
    assert.equal(secondValidation, 1);
  });

  it('amout of changes should be calculated as 4 and 9 and filled into the fileMap', () => {
    const fileMapForCalculations = [
      { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:15:28', stats: [3, 1, 'Bugfix_2.txt'] },
      { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:04:11', stats: [5, 0, 'Bugfix_2.txt'] },
      { file: 'Bugfix_1.txt', latestDate: '2019-02-06 T10:00:42', stats: [3, 1, 'Bugfix_1.txt'] },
    ];
    doTheCalculations(fileMapForCalculations);
    const isValid = fileMap['Bugfix_1.txt'].changes;
    assert.equal(isValid, 4);
    const secondValidation = fileMap['Bugfix_2.txt'].changes;
    assert.equal(secondValidation, 9);
  });

  it('amout of commits should be calculated as 2 and 1 and filled into the fileMap', () => {
    const fileMapForCalculations = [
      { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:15:28', stats: [3, 1, 'Bugfix_2.txt'] },
      { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:04:11', stats: [5, 0, 'Bugfix_2.txt'] },
      { file: 'Bugfix_1.txt', latestDate: '2019-02-06 T10:00:42', stats: [3, 1, 'Bugfix_1.txt'] },
    ];
    doTheCalculations(fileMapForCalculations);
    const isValid = fileMap['Bugfix_2.txt'].commits;
    assert.equal(isValid, 2);
    const secondValidation = fileMap['Bugfix_1.txt'].commits;
    assert.equal(secondValidation, 1);
  });
});
*/
