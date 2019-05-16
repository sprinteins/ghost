const { spawn } = window.bridge;

export default function log(path, doneCB, progressCB) {

  let noOfFiles = 0;
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
    '--grep=bugfix/',
  ];

  // git command:
  // git log --merges --numstat -m --first-parent master --pretty=%cD --grep=bugfix/

  const gitLog = spawn(cmd, cmdArgs, { cwd: path });

  gitLog.stdout.on('data', (data) => {
    let lines = data.toString().split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i] === '') {
        lines.splice(i, 1);
      }
    }

    let latestDate;
    let commitDate = 'commitDate';

    lines.forEach((line) => {
      const stats = line.split('\t');
      const additions = parseInt(stats[0]);
      const deletions = parseInt(stats[1]);
      const file = stats[2];

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
        return;
      }
      if (!fileMap[file]) {
        fileMap[file] = {
          file,
          additions: 0,
          deletions: 0,
          changes: 0,
          commits: 0,
          latestDate,
        };
      }

      fileMap[file].additions += additions;
      fileMap[file].deletions += deletions;
      fileMap[file].changes += additions + deletions;
      fileMap[file].commits += 1;

      if (
        fileMap[file].latestDate === undefined
        || fileMap[file].latestDate === ''
      ) {
        fileMap[file].latestDate = commitDate.slice(5, -5);
      }
    });

    noOfFiles += lines.length / 2;
    progressCB(noOfFiles);
  });

  gitLog.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  gitLog.on('close', (code) => {
    // console.log('child process exited with code ' + code);
    if (code === 0) {
      console.log('child process complete.');
    } else {
      console.log(`child process exited with code ${code}`);
    }

    console.log('filemap : ', fileMap);
    doneCB(fileMap, noOfFiles);
  });
}
