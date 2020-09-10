let config

export function initConfig() {
  const envConfig = {
    default: {
      DEV: false,
      PORT: 3000,
    },
    dev: {
      DEV: true,
    },
    prd: {
      DEV: false,
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
