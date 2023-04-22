import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const getHttpStatus = () => {
      if (exception instanceof HttpException) {
        return exception.getStatus()
      } else {
        HttpStatus.INTERNAL_SERVER_ERROR
      }
    }

    const getResponseBody = () => {
      const body: Record<string, any> = {
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      }

      switch (true) {
        case typeof exception?.response === 'string':
          body.message = exception?.response
          break
        case typeof exception?.response?.message === 'string':
          body.message = exception?.response?.message
          break
      }

      if (exception?.response?.toast) {
        body.toast = true
      }

      return body
    }

    httpAdapter.reply(ctx.getResponse(), getResponseBody(), getHttpStatus())
  }
}
