/* eslint-disable import/no-extraneous-dependencies,global-require */
import _ from 'lodash'
import cookieParser from 'cookie-parser'
import express from 'express'
import history from 'connect-history-api-fallback'
import http from 'http'
import morgan from 'morgan'
import path from 'path'
import fileUpload from 'express-fileupload'
import { Router as AsyncRouter } from '@awaitjs/express'

import apiRoutes from './routes/api'
import settingsApiRoutes from './routes/settingsApi'

import { initConfig, config as appConfig } from './config'
import { initLogger, log } from './log'
import { initDatabase } from './data/models'

async function init() {
  initConfig()
  initLogger()
  await initDatabase()
}

export default init()
  .then(() => {
    log.info(`Initializing Express (${process.env.NODE_ENV})`)
    const app = express()

    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(fileUpload({}))

    const apiRouter = new AsyncRouter()
    apiRouter.use(apiRoutes)
    apiRouter.use(settingsApiRoutes)

    app.use('/api', apiRouter)
    app.use(express.static(path.join(__dirname, 'static')))

    if (process.env.NODE_ENV !== 'production') {
      log.info('Setting up Webpack Middlewares')

      app.use(history({
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
      }))

      const Webpack = require('webpack')
      const WebpackDevMiddleware = require('webpack-dev-middleware')
      const WebpackHotMiddleware = require('webpack-hot-middleware')
      const webpackConfig = require('../webpack.config')

      const compiler = Webpack(webpackConfig(process.env))
      app.use(WebpackDevMiddleware(compiler, {
        publicPath: '/',
        stats: { colors: true },
        lazy: false,
        watchOptions: {
          aggregateTimeout: 300,
          poll: true
        }
      }))
      app.use(WebpackHotMiddleware(compiler))

    } else {
      app.get('*', (req, res, next) => {
        res.sendFile(path.join(__dirname, './static/client/index.html'))
      })
    }

    // error handler
    app.use((err, req, res, next) => {
      log.error(err.stack)
      const jsonResponse = { title: err.message, code: err.errorCode || 'INTERNAL_ERROR' }
      if (!_.isEmpty(err.meta)) jsonResponse.meta = err.meta
      res.status(err.httpStatus || 500).json(jsonResponse)
    })

    app.disable('x-powered-by')

    // Create Server
    const server = http.createServer(app)

    app.set('port', appConfig.PORT)
    server.listen(appConfig.PORT, () => log.info(`Listening on ${appConfig.PORT}`))
  })
