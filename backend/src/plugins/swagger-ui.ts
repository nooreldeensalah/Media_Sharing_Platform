import fp from 'fastify-plugin'
import swaggerUi, { FastifySwaggerUiOptions } from '@fastify/swagger-ui'

export default fp<FastifySwaggerUiOptions>(async (fastify) => {
  fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) {
        next()
      },
      preHandler: function (_request, _reply, next) {
        next()
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject
    },
    transformSpecificationClone: true,
  })

}, {
  dependencies : ['swagger']
})
