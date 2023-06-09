import { Injectable } from '@nestjs/common'
import { AsyncLocalStorage } from 'node:async_hooks'
import { Request, Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { IncomingMessage } from 'node:http'
import { AppOrigin } from 'src/config/enum.config'
import { FastifyRequest } from 'fastify'

export function RequestContextMiddleware(
  req: FastifyRequest,
  res: Response,
  next: () => void,
) {
  RequestContext.cls.run(RequestContext.create(req, res), next)
}

@Injectable()
export class RequestContext {
  private req: FastifyRequest
  private res: Response

  static cls = new AsyncLocalStorage<RequestContext>()

  static get currentContext() {
    return this.cls.getStore()
  }

  private get payload() {
    const jwtService = new JwtService()
    const request = RequestContext.currentContext.req as FastifyRequest
    const jwt = request.headers.authorization

    return jwtService.decode(jwt.replace('Bearer ', '')) as {
      id: string
      username: string
      origin: AppOrigin
    }
  }

  public get origin() {
    return this.payload?.origin
  }

  public get user() {
    return this.payload?.id
  }

  public get host() {
    return this.req.headers.host
  }

  public static create(req: FastifyRequest, res: Response) {
    const context = new RequestContext()
    context.req = req
    context.res = res
    return context
  }
}
