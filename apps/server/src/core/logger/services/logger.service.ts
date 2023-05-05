import { Injectable, LoggerService } from '@nestjs/common'
import * as log4js from 'log4js'

@Injectable()
export class Logger implements LoggerService {
  private _logger: log4js.Logger

  private readonly log4jsDevConfig: log4js.Configuration = {
    appenders: {
      default: { type: 'console' },
    },
    categories: {
      default: { appenders: ['default'], level: 'all' },
    },
  }

  private readonly log4jsProdConfig: log4js.Configuration = {
    appenders: {
      default: { type: 'console' },
      debug: {
        type: 'dateFile',
        filename: 'logs/debug.log',
        numBackups: 30,
      },
      error: {
        type: 'dateFile',
        filename: 'logs/error.log',
        numBackups: 30,
      },
      debugFilter: {
        type: 'logLevelFilter',
        appender: 'debug',
        level: 'debug',
      },
      errorFilter: {
        type: 'logLevelFilter',
        appender: 'error',
        level: 'error',
      },
    },
    categories: {
      default: {
        appenders: ['default', 'debugFilter', 'errorFilter'],
        level: 'all',
      },
    },
  }

  constructor() {
    log4js.configure(
      process.env.NODE_ENV === 'development'
        ? this.log4jsDevConfig
        : this.log4jsProdConfig,
    )
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
