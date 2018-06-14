# parcel-react-electron

A minimal Electron + React.js boilerplate with [parcel as bundler](https://github.com/parcel-bundler/parcel). Parcel is an alternative web application bundler to Webpack.

## Installation

* `git@github.com:Snjoo/parcel-react-electron.git`
* `cd parcel-react-electron`
* `yarn`

## Usage

### Development mode
Run these commands to start dev server and Electron app
``` bash
# Parcel bundles the code and runs dev server
$ yarn dev

# Run the electron app which uses local dev server
$ yarn start-dev
```

### Production mode and packaging app
Run this command to bundle code in production mode
``` bash
# Parcel bundle code once
$ yarn build

# Create executables
$ yarn dist
```
