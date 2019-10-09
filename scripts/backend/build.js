// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Ensure environment variables are read.
const fs = require('fs-extra');
require('../../config/backend/env');
const paths = require('../../config/backend/paths');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const configFactory = require('../../config/backend/webpack.config');
const clearConsole = require('react-dev-utils/clearConsole');

// Generate configuration
const config = configFactory('production');

const compiler = webpack(config);

const progressPlugin = new webpack.ProgressPlugin((percent, msg, addInfo) => {
  percent = Math.floor(percent * 100);
  if (msg === 'compiling') {
    copyExtraFolder();
    console.log(chalk.cyan('Started compiling...'));
  }
});

progressPlugin.apply(compiler);

const watching = compiler.run((err, stats) => {
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
  } else {
    clearConsole();
    console.log(chalk.green('Successful compiled'));
  }
});
function copyExtraFolder() {
  fs.copySync(paths.appExtra, paths.appBuild, {
    dereference: true,
    //filter: (file) => file !== paths.appHtml,
  });
}
