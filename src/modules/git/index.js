const { spawn } = window.bridge;

export default function log(path, doneCB, progressCB) {
  let noOfFiles = 0;
  let fileMap = {};
  const cmd = "git";
  const cmdArgs = [
    "log",
    "--merges",
    "--numstat",
    "-m",
    "--first-parent",
    "master",
    "--pretty=%cD",
    "--grep=bugfix/"
  ];

  const gitLog = spawn(cmd, cmdArgs, { cwd: path });

  gitLog.stdout.on("data", data => {
    let lines = data.toString().split("\n");
    lines = lines.slice(0, -1);
    let date;

    lines.forEach(line => {
      let stats = line.split("\t");
      let additions = parseInt(stats[0]);
      let deletions = parseInt(stats[1]);
      let file = stats[2];

      if (!fileMap[file]) {
        fileMap[file] = {
          file,
          additions: 0,
          deletions: 0,
          changes: 0,
          commits: 0,
          date
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

  gitLog.stderr.on("data", data => {
    console.log("stderr: " + data);
  });

  gitLog.on("close", code => {
    // console.log('child process exited with code ' + code);
    if (code === 0) {
      console.log("child process complete.");
    } else {
      console.log("child process exited with code " + code);
    }

    doneCB(fileMap, noOfFiles);
  });
}
