import { USER_STORAGE_PATH } from './storage'

let config

export function initConfig() {
  const envConfig = {
    default: {
      DEV: false,
      PORT: 3000,
      allowReplaceDailyUpload: false,
      databaseStorage: `${USER_STORAGE_PATH}/database.sqlite`,
      databaseTimestamps: true
    },
    dev: {
      DEV: true,
      allowReplaceDailyUpload: true
    },
    prd: {
      DEV: false
    }
  }

  const { APP_ENV = 'dev' } = process.env

  config = {
    ...envConfig.default,
    ...envConfig[APP_ENV],
    APP_ENV
  }

  return config
}

export { config }
