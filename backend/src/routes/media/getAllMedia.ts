import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };

  fastify.get('/', async (req, reply) => {
    try {
        const objectsStream = fastify.minio.listObjects(BUCKET_NAME, '', true);
        const files: { name: string; url: string }[] = [];

        for await (const obj of objectsStream) {
            const url = await fastify.minio.presignedGetObject(BUCKET_NAME, obj.name);
            files.push({ name: obj.name, url });
        }

        reply.send(files);
    } catch (err) {
        reply.status(500).send({ message: 'Error fetching media files'});
    }
});
}

export default root;
