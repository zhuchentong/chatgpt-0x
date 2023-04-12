module.exports = {
  gateway: 'http://127.0.0.1:4000',
  openapi: '/client/api-docs',
  output: './src/http',
  exportModels: true,
  applications: {},
  logger: true,
  exportServices: {
    responseType: 'promise',
    excludeQueryParams: ['page', 'size', 'order', 'sort', 'paged', 'unpaged'],
  },
}
