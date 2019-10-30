import { doTheCalculations } from '../../src/modules/git/calculations';
import { IMergeWithStats } from '../../src/modules/git/parsing';
import assert from 'assert';

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
