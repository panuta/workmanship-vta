import bunyan from 'bunyan'
import loggerFormat from 'bunyan-format'

import { config as appConfig } from './config'

let log

export function initLogger() {
  log = bunyan.createLogger({
    name: 'App',
    env: appConfig.APP_ENV,
    stream: loggerFormat({ outputMode: appConfig.DEV ? 'short' : 'json' }),
    level: appConfig.DEV ? 'debug' : 'info',
    serializers: bunyan.stdSerializers
  })
}

export { log }
