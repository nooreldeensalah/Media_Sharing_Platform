import { FastifyPluginAsync } from 'fastify'

const deleteMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  fastify.delete('/:fileName', async (req, reply) => {
    const { fileName } = req.params as { fileName: string };

    try {
        await fastify.minio.removeObject(BUCKET_NAME, fileName);
        reply.send({ message: `File ${fileName} deleted successfully!` });
    } catch (err) {
        reply.internalServerError('Error deleting file');
    }
});
}

export default deleteMedia;
