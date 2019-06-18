const { spawn } = window.bridge;

export default function log(
  path,
  doneCB,
  progressCB,
  queryParameter,
  fileExtensionArray
) {
  const fileMap = {};
  const cmd = 'git';
  const cmdArgs = [
    'log',
    '--merges',
    '--numstat',
    '-m',
    '--first-parent',
    'master',
    '--pretty=%cD',
    `--grep=${queryParameter}/`
  ];

  // git command:
  // git log --merges --numstat -m --first-parent master --pretty=%cD --grep=bugfix/

  const prefix = '*.';
  const prefixString = prefix.concat(fileExtensionArray.join(',*.'));
  const extensions = prefixString.split(',');

  const cmdArgsWithExtensions = cmdArgs.concat(extensions);

  let finalcount = 0;
  const gitLog = spawn(cmd, cmdArgsWithExtensions, { cwd: path });

  gitLog.stdout.on('data', data => {
    const lines = data.toString().split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i] === '') {
        lines.splice(i, 1);
      }
    }

    let latestDate;
    let commitDate = 'commitDate';
    let count = 0;

    lines.forEach(line => {
      const stats = line.split('\t');
      const additions = parseInt(stats[0]);
      const deletions = parseInt(stats[1]);
      const file = stats[2];

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
        return;
      }

      if (!fileMap[file]) {
        fileMap[file] = {
          file,
          additions: 0,
          deletions: 0,
          changes: 0,
          commits: 0,
          latestDate
        };
      }

      fileMap[file].additions += additions;
      fileMap[file].deletions += deletions;
      fileMap[file].changes += additions + deletions;
      fileMap[file].commits += 1;

      if (
        fileMap[file].latestDate === undefined ||
        fileMap[file].latestDate === ''
      ) {
        let formatedDate = commitDate.slice(5, -5);

        const formatedSplittedDate = formatedDate.split(' ');

        if (formatedSplittedDate[0].length < 2) {
          let formatedSplittedPaddedDate = formatedSplittedDate[0];
          formatedSplittedPaddedDate = `0${formatedSplittedPaddedDate[0]}`;
          formatedSplittedDate[0] = formatedSplittedPaddedDate;
        }

        switch (formatedSplittedDate[1]) {
          case 'Jan':
            formatedSplittedDate[1] = '01';
            break;
          case 'Feb':
            formatedSplittedDate[1] = '02';
            break;
          case 'Mar':
            formatedSplittedDate[1] = '03';
            break;
          case 'Apr':
            formatedSplittedDate[1] = '04';
            break;
          case 'May':
            formatedSplittedDate[1] = '05';
            break;
          case 'Jun':
            formatedSplittedDate[1] = '06';
            break;
          case 'Jul':
            formatedSplittedDate[1] = '07';
            break;
          case 'Aug':
            formatedSplittedDate[1] = '08';
            break;
          case 'Sep':
            formatedSplittedDate[1] = '09';
            break;
          case 'Oct':
            formatedSplittedDate[1] = '10';
            break;
          case 'Nov':
            formatedSplittedDate[1] = '11';
            break;
          case 'Dec':
            formatedSplittedDate[1] = '12';
            break;
          default:
            break;
        }
        formatedDate = `${formatedSplittedDate[2]}-${formatedSplittedDate[1]}-${
          formatedSplittedDate[0]
        } T${formatedSplittedDate[3]}`;

        fileMap[file].latestDate = formatedDate;
      }
      count += 1;
    });

    finalcount += count;

    progressCB(finalcount);
  });

  gitLog.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
  });

  gitLog.on('close', code => {
    // console.log('child process exited with code ' + code);
    if (code === 0) {
      console.log('child process complete.');
    } else {
      console.log(`child process exited with code ${code}`);
    }

    document.body.classList.remove('busy-cursor');
    const ele = document.getElementById('loadingscreen');
    ele.classList.add('loadingscreen-passive');
    ele.classList.remove('loadingscreen-active');

    doneCB(fileMap, finalcount);
  });
}
