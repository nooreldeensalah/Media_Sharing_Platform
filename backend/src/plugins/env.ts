import fp from 'fastify-plugin'
import env, { FastifyEnvOptions } from '@fastify/env'

export default fp<FastifyEnvOptions>(async (fastify) => {
  fastify.register(env, {
    dotenv: true,
    schema: {
      type: 'object'
    }
  }
  )
})
