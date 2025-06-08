import fp from 'fastify-plugin'
import env, { FastifyEnvOptions } from '@fastify/env'

export default fp<FastifyEnvOptions>(async (fastify) => {
  fastify.register(env, {
    dotenv: true,
    schema: {
      type: 'object',
      required: ['JWT_SECRET', 'DATABASE_FILE_NAME', 'BUCKET_NAME'],
      properties: {
        JWT_SECRET: { type: 'string', minLength: 32 },
        DATABASE_FILE_NAME: { type: 'string' },
        BUCKET_NAME: { type: 'string' },
        S3_ACCESS_KEY: { type: 'string' },
        S3_SECRET_KEY: { type: 'string' },
        S3_ENDPOINT: { type: 'string' },
        S3_REGION: { type: 'string' },
        FASTIFY_PORT: { type: 'string', default: '3000' },
        FASTIFY_ADDRESS: { type: 'string', default: '0.0.0.0' }
      }
    }
  })
})
