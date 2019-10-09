// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
const fs = require('fs-extra');
var electron = require('electron');

var proc = require('child_process');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
require('../../config/backend/env');
const paths = require('../../config/backend/paths');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const configFactory = require('../../config/backend/webpack.config');
const clearConsole = require('react-dev-utils/clearConsole');

// Generate configuration
const config = configFactory('development');

const compiler = webpack(config);

const progressPlugin = new webpack.ProgressPlugin((percent, msg, addInfo) => {
  percent = Math.floor(percent * 100);
  if (msg === 'compiling') {
    copyExtraFolder();
    console.log(chalk.cyan('Started compiling...'));
  }
});

progressPlugin.apply(compiler);

const watching = compiler.watch(
  {
    // Example watchOptions
    aggregateTimeout: 300,
    poll: undefined,
  },
  (err, stats) => {
    if (stats.hasErrors() || stats.hasWarnings()) {
      console.log(
        stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true, // Shows colors in the console
          logging: 'info',
          excludeModules: true,
          modules: false,
          moduleTrace: false,
          outputPath: false,
          performance: false,
          reasons: false,
          timings: false,
          chunkOrigins: false,
          assets: false,
        }),
      );
    }
    if (!stats.hasErrors()) {
      clearConsole();
      console.log(chalk.green('Successful compiled'));
      restartElectron();
    }
  },
);
function copyExtraFolder() {
  fs.copySync(paths.appExtra, paths.appBuild, {
    dereference: true,
    //filter: (file) => file !== paths.appHtml,
  });
}

let child;
function restartElectron() {
  console.log(child);
  if (child) {
    child.kill('SIGHUP');
    console.log(child)
  }
  child = proc.spawn(electron, ['./build/backend/bundle.js'], { stdio: 'inherit', windowsHide: false });
  child.on('close', function (code) {
    process.exit(code);
  });

  const handleTerminationSignal = function (signal) {
    process.on(signal, function signalHandler() {
      if (!child.killed) {
        child.kill(signal);
      }
    });
  };

  handleTerminationSignal('SIGINT');
  handleTerminationSignal('SIGTERM');
}
