const { spawn } = window.require('child_process');

export default function log(path, doneCB, progressCB) {
  let noOfFiles = 0;
  const fileMap = {};
  const cmd = 'git';
  const cmdArgs = [
    'log',
    '--merges',
    '--numstat',
    '-m',
    '--pretty=tformat:',
    '--grep=from bugfix/',
  ];

  const gitLog = spawn(cmd, cmdArgs, { cwd: path });

  gitLog.stdout.on('data', (data) => {
    let lines = data.toString().split('\n');
    lines = lines.slice(0, -1);
    let date;

    lines.forEach((line) => {
      const stats = line.split('\t');
      const additions = parseInt(stats[0]);
      const deletions = parseInt(stats[1]);
      const file = stats[2];

      if (!fileMap[file]) {
        fileMap[file] = {
          file,
          additions: 0,
          deletions: 0,
          changes: 0,
          commits: 0,
          date,
        };
      }

      fileMap[file].additions += additions;
      fileMap[file].deletions += deletions;
      fileMap[file].changes += additions + deletions;
      fileMap[file].commits += 1;
    });

    noOfFiles += lines.length;
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

    doneCB(fileMap, noOfFiles);
  });
}
