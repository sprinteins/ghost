import formatting from './the-real-formatting';
import { fileMap, finalcount } from './calculations';

const { spawn } = window.bridge;

export default function gLog(path, doneCB, queryParameter) {
  const cmd = 'git';
  const cmdArgs = [
    'log',
    '--merges',
    '--numstat',
    '-m',
    '--first-parent',
    'master',
    '--pretty=%cD',
    `--grep=${queryParameter}/`,
  ];

  // git command:
  // git log --merges --numstat -m --first-parent master --pretty=%cD --grep=bugfix/

  const gitLog = spawn(cmd, cmdArgs, { cwd: path });

  let output = '';

  gitLog.stdout.on('data', (data) => {
    const lines2 = data.toString();

    output += lines2;
    // console.log('Repeating the stream output ', output);
  });

  gitLog.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    formatting(output);
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
