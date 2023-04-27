import { Injectable, LoggerService } from '@nestjs/common'
import * as log4js from 'log4js'

@Injectable()
export class Logger implements LoggerService {
  private _logger: log4js.Logger

  constructor() {
    const appender = { type: 'console' }
    // process.env.NODE_ENV === 'development'
    //   ? { type: 'console' }
    //   : {
    //       type: 'dateFile',
    //       filename: 'logs/output.log',
    //       compress: true,
    //     }

    log4js.configure({
      appenders: {
        app: appender,
      },
      categories: {
        default: { appenders: ['app'], level: 'all' },
      },
    })
  }

  private get logger() {
    if (!this._logger) this._logger = log4js.getLogger()

    return this._logger
  }

  info(message: any, ...args) {
    this.logger.info(message, ...args)
  }

  log(message: any, ...args) {
    this.logger.info(message, ...args)
  }

  error(message: any, ...args) {
    this.logger.error(message, ...args)
  }

  warn(message: any, ...args) {
    this.logger.warn(message, ...args)
  }

  debug(message: any, ...args) {
    this.logger.debug(message, ...args)
  }

  verbose(message: any, ...args) {
    this.logger.info(message, ...args)
  }
}
