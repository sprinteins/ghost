const { spawn } = require('child_process');

export function gitLogSpawn() {
  return spawn('node git.js');
}
