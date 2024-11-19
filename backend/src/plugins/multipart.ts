import fp from 'fastify-plugin'
import multipart, { FastifyMultipartOptions } from '@fastify/multipart'

export default fp<FastifyMultipartOptions>(async (fastify) => {
  fastify.register(multipart)
})
