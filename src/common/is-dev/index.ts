import * as electron from 'electron'

const app = electron.app || electron.remote.app

const isEnvSet = 'ELECTRON_IS_DEV' in process.env
const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1

const isDev = isEnvSet ? getFromEnv : !app.isPackaged
export default isDev
