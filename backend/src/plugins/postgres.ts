import fp from 'fastify-plugin'
import postgres, { PostgresPluginOptions } from '@fastify/postgres'

export default fp<PostgresPluginOptions>(async (fastify) => {
  const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_DB } = process.env
  const connectionString = `postgres://${POSTGRES_USER}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`

  fastify.register(postgres, {
    connectionString
  })
})
