import { parsing } from './parsing';
import { doTheCalculations, IFileMapObject } from './calculations';

const { spawn } = window.bridge;

type IgLogCallback = (fileMap: object, noOfFiles: number) => void;

// think about an object instead of a lot of parameters
export default function gLog(
  path: string,
  doneCB: IgLogCallback,
  queryParameter: string,
  fileExtension: string,
  fileExtentionExclusion: string,
) {
  if (!window) {
    return;
  }
  const cmd = 'git';
  let cmdArgs = ['log', '--merges', '--numstat', '-m', '--first-parent', 'master', '--pretty=%cD', `--grep=${queryParameter}/`];

  // git command:
  // git log --merges --numstat -m --first-parent master --pretty=%cD --grep=bugfix/

  if (fileExtentionExclusion === '') {
    let prefix = '*.';
    if (fileExtension === '') {
      fileExtension = '*';
    }
    const fileExtensionArray = fileExtension.split(',');
    prefix += fileExtensionArray.join(',*.');
    const extensions = prefix.split(',');
    cmdArgs = cmdArgs.concat(extensions);
  } else {
    let prefix2 = '--,.,:^*.';
    prefix2 += fileExtentionExclusion.replace(/,/g, ',:^*.');
    const exclusions = prefix2.split(',');
    cmdArgs = cmdArgs.concat(exclusions);
  }

  const gitLog = spawn(cmd, cmdArgs, { cwd: path });

  let output = '';

  gitLog.stdout.on('data', (data) => {
    output += data.toString();
  });

  gitLog.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    const parseResult = parsing(output);
    //console.log(output);
    if (code === 0) {
      console.log('child process complete.');
    } else {
      console.log(`child process exited with code ${code}`);
    }
    doTheCalculations(parseResult);
    //const { fileMap, finalCount }
    //doneCB(fileMap, finalCount);
  });
}
