import formatting from './formatting';
import { fileMap, finalcount } from './calculations';

const { spawn } = window.bridge;

export default function gLog(path, doneCB, queryParameter, fileExtension, fileExtentionExclusion) {
  const cmd = 'git';
  let cmdArgs = [
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

  if (fileExtentionExclusion === '') {
    const prefix = '*.';
    if (fileExtension === '') {
      fileExtension = '*';
    }
    const fileExtensionArray = fileExtension.split(',');
    const prefixString = prefix.concat(fileExtensionArray.join(',*.'));
    const extensions = prefixString.split(',');
    cmdArgs = cmdArgs.concat(extensions);
  } else {
    const prefix = '';
    const prefix2 = prefix.concat('--,', '.,', ':^*.')
    const fileExtentionExclusionArray = fileExtentionExclusion.split(',');
    const prefixString = prefix2.concat(fileExtentionExclusionArray.join(',:^*.'));
    const exclusions = prefixString.split(',');
    cmdArgs = cmdArgs.concat(exclusions);
  }

  const gitLog = spawn(cmd, cmdArgs, { cwd: path });

  let output = '';

  gitLog.stdout.on('data', (data) => {
    output += data.toString();
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