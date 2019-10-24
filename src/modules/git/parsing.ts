import { IFileMapObject } from './calculations';

export function parsing(output: string): IFileMapObject[] {
  let newFileMap: IFileMapObject[];
  let commitDate = 'commitDate';
  const latestDate = '';
  // creates Array, new element every linebreak
  const lines = output.split('\n');

  const requiredLines = lines.reduce((newArray: string[], value) => {
    if (value !== '') {
      return newArray.concat(value);
    }
    return newArray;
  }, []);

  newFileMap = requiredLines.reduce((accum: object[], line) => {
    const stats = line.split('\t');

    const file = stats[2];
    // checks wether the filename is undefined or not, if so it has to be a date
    if (file === undefined) {
      if (
        line.startsWith('Mon, ') ||
        line.startsWith('Tue, ') ||
        line.startsWith('Wed, ') ||
        line.startsWith('Thu, ') ||
        line.startsWith('Fri, ') ||
        line.startsWith('Sat, ') ||
        line.startsWith('Sun, ')
      ) {
        commitDate = line;
      }
      return accum;
    }
    // fills subFileMap with default values and filename
    const subFileMap = {
      file,
      stats,
      latestDate,
    };

    if (subFileMap.latestDate === undefined || subFileMap.latestDate === '') {
      const unformattedDate = commitDate.slice(5, -5);

      const formattedDate: string = formatDate(unformattedDate);

      subFileMap.latestDate = formattedDate;
      // adds object to the filemap without overriding if the same file already exists
      return accum.concat(subFileMap);
    }

    return accum;
  }, []) as IFileMapObject[];
  return newFileMap;
}

const formatDate = (unformattedDate: string) => {
  const splittedDate = unformattedDate.split(' ');
  let [day, month] = splittedDate;
  const [_, __, year, time] = splittedDate;
  if (day.length < 2) {
    day = `0${day}`;
  }
  month = translateMonth(month);
  return `${day}.${month}.${year} ${time}`;
};

const translateMonth = (stringWithMonth: string): string => {
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
  return monthMapToNumber[stringWithMonth];
};
