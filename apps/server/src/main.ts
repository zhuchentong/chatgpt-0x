import { RequestMethod, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { AdminModule } from './modules/admin/admin.module'
import { ClientModule } from './modules/client/client.module'
import { QiniuModule } from './shared/qiniu/qiniu.module'
import { WechatModule } from './shared/wechat/wechat.module'
import { RequestContextMiddleware } from './middlewaves/request-context.middlewave'
import { ExceptionsFilter } from './filters/exceptions.filter'
import { OpenAIModule } from './shared/openai/openai.module'
/**
 * 配置Swagger
 * @param app
 */
function setupSwagger(app: NestFastifyApplication) {
  const adapter = app.getHttpAdapter()

  /**
   * 配置管理端Swagger接口
   */
  function setupAdminDocument() {
    const adminDocumentConfig = new DocumentBuilder()
      .setTitle('Admin接口文档')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addTag('app', '系统')
      .addTag('administrator', '管理员')
      .addTag('qiniu', '七牛')
      .addTag('wechat', '微信')
      .addTag('assistant', '助手')
      .addTag('product', '产品')
      .addTag('active-code', '激活码')
      .addTag('order', '订单')
      .addTag('refund', '退款')
      .addTag('balance', '余额')
      .addTag('key', 'OpenAI Key')
      .build()

    const adminDocument = SwaggerModule.createDocument(
      app,
      adminDocumentConfig,
      {
        include: [AdminModule, QiniuModule, WechatModule, OpenAIModule],
      },
    )

    SwaggerModule.setup('admin/docs', app, adminDocument, {
      customCssUrl: '/swagger-ui.css',
    })

    // 设置OPENAPI接口地址
    adapter.get('/admin/api-docs', function (req, res) {
      res.send(JSON.stringify(adminDocument))
    })
  }

  /**
   * 配置小程序Swagger接口
   */
  function setupClientDocument() {
    const clientDocumentConfig = new DocumentBuilder()
      .setTitle('Client接口文档')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addTag('app', '系统')
      .addTag('user', '用户')
      .addTag('qiniu', '七牛')
      .addTag('openai', 'OpenAI')
      .addTag('wechat', '微信')
      .addTag('assistant', '助手')
      .addTag('product', '产品')
      .addTag('active-code', '激活码')
      .addTag('order', '订单')
      .addTag('balance', '余额')
      .build()

    const clientDocument = SwaggerModule.createDocument(
      app,
      clientDocumentConfig,
      {
        include: [ClientModule, QiniuModule, WechatModule],
      },
    )

    SwaggerModule.setup('client/docs', app, clientDocument, {
      customCssUrl: '/swagger-ui.css',
    })

    // 设置OPENAPI接口地址
    adapter.get('/client/api-docs', function (req, res) {
      res.send(JSON.stringify(clientDocument))
    })
  }

  setupAdminDocument()
  setupClientDocument()
}

/**
 * 初始化应用
 * @returns
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: true,
      rawBody: true,
    },
  )

  app.useBodyParser('text/xml')

  // 安装全局前缀
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '',
        method: RequestMethod.ALL,
      },
    ],
  })

  // 安装验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  app.useGlobalFilters(new ExceptionsFilter(app.get(HttpAdapterHost)))

  // 安装中间件
  app.use(RequestContextMiddleware)
  // 安装Swagger
  setupSwagger(app)

  return app
}

/**
 * 启动应用
 * @param app
 */
async function launch(app: NestFastifyApplication) {
  const config = app.get(ConfigService)

  const port = await config.get('app.port')

  await app.listen(port, '0.0.0.0').then(() => {
    console.log(`launch at ${port}`)
  })
}

// 初始化并启动应用
bootstrap().then(launch)
