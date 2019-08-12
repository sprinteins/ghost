import doTheCalculations from './calculations';

export let newFileMap = [];

export default function formatting(output) {
  let latestDate;
  let commitDate = 'commitDate';
  // creates Array, new element every linebreak
  const lines = output.split('\n');

  const requiredLines = lines.reduce((newArray, value) => {
    if (value !== '') {
      return newArray.concat(value);
    }
    return newArray;
  }, []);

  newFileMap = requiredLines.reduce((accum, line) => {
    let subFileMap = {};
    const stats = line.split('\t');

    const file = stats[2];
    // checks wether the filename is undefined or not, if so it has to be a date
    if (file === undefined) {
      if (
        line.startsWith('Mon, ')
        || line.startsWith('Tue, ')
        || line.startsWith('Wed, ')
        || line.startsWith('Thu, ')
        || line.startsWith('Fri, ')
        || line.startsWith('Sat, ')
        || line.startsWith('Sun, ')
      ) {
        commitDate = line;
      }
      return accum;
    }
    // fills subFileMap with default values and filename
    subFileMap = {
      file,
      stats,
      latestDate,
    };

    if (subFileMap.latestDate === undefined || subFileMap.latestDate === '') {
      const formatedDate = commitDate.slice(5, -5);
      // splits the date where spaces exit into array so each elemet can be acessed
      const formatedSplittedDate = formatedDate.split(' ');
      // inserts 0s to single digits
      if (formatedSplittedDate[0].length < 2) {
        let formatedSplittedPaddedDate = formatedSplittedDate[0];
        formatedSplittedPaddedDate = `0${formatedSplittedPaddedDate[0]}`;
        formatedSplittedDate[0] = formatedSplittedPaddedDate;
      }

      const monthMapToNumber = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
      };
      // swaps the months name for the equvalent number
      const monthAsNumber = monthMapToNumber[formatedSplittedDate[1]];
      // assignes the date value to the subFileMap param
      subFileMap.latestDate = `${formatedSplittedDate[2]}-${monthAsNumber}-${formatedSplittedDate[0]} T${formatedSplittedDate[3]}`;
      // adds object to the filemap without overriding if the same file already exists
      return accum.concat(subFileMap);
    }

    return accum;
  }, []);
  doTheCalculations(newFileMap);
}
