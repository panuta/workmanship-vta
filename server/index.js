/* eslint-disable import/no-extraneous-dependencies,global-require */
// import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import path from 'path'

import homeRoutes from './routes/home'
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
    const app = express()

    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    // View Engine
    // app.set('views', path.join(__dirname, 'templates'))
    // app.set('view engine', 'ejs')

    // app.use(sassMiddleware({
    //   src: path.join(__dirname, 'static'),
    //   dest: path.join(__dirname, 'static'),
    //   indentedSyntax: false,
    //   sourceMap: true
    // }))

    app.use(express.static(path.join(__dirname, 'static')))

    if (process.env.NODE_ENV !== 'production') {
      log.info('Setting up Webpack Middlewares');

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
      app.use('/', homeRoutes)
    }

    app.use('/', homeRoutes)

    // // catch 404 and forward to error handler
    // app.use(function(req, res, next) {
    //   next(createError(404))
    // })

    // error handler
    // app.use(function(err, req, res, next) {
    //   // set locals, only providing error in development
    //   res.locals.message = err.message
    //   res.locals.error = req.app.get('env') === 'development' ? err : {}
    //
    //   // render the error page
    //   res.status(err.status || 500)
    //   res.render('error')
    // })

    app.disable('x-powered-by')

    // Create Server
    const server = http.createServer(app)

    app.set('port', appConfig.PORT)
    server.listen(appConfig.PORT, () => log.info(`Listening on ${appConfig.PORT}`))
  })
