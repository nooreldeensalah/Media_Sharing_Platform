import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  fastify.get('/:fileName', async (request, reply) => {
    const { fileName } = request.params as { fileName: string };

    try {
        const url = await fastify.minio.presignedGetObject(BUCKET_NAME, fileName);
        reply.send({ url });
    } catch (err) {
        reply.notFound('File not found');
    }
});
}

export default root;
