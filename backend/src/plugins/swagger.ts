import fp from 'fastify-plugin'
import swagger, { FastifySwaggerOptions } from '@fastify/swagger'

export default fp<FastifySwaggerOptions>(async (fastify) => {
  fastify.register(swagger, {
    openapi: {
      info: {
        title: "Media Feed API",
        version: '0.1.0',
      },
    },
  })
}, {
  name: 'swagger',
})
