import { FastifyPluginAsync } from 'fastify'

const getPreSignedPutURLSchema = {
  tags: ["media"],
  body: {
    type: 'object',
    required: ['fileName', 'mimeType'],
    properties: {
      fileName: { type: 'string' },
      mimeType: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        url: { type: 'string' }
      }
    }
  }
}

const getPreSignedPutURL: FastifyPluginAsync = async (fastify): Promise<void> => {
  const { BUCKET_NAME } = process.env as { BUCKET_NAME: string };
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mpeg', 'video/quicktime'];

  const ensureBucketExists = async (bucketName: string) => {
    const exists = await fastify.minio.bucketExists(bucketName);
    if (!exists) {
      await fastify.minio.makeBucket(bucketName);
    }
  };

  fastify.post('/upload-url', { schema: getPreSignedPutURLSchema }, async (request, reply) => {
    const { fileName, mimeType } = request.body as { fileName: string, mimeType: string };

    if (!allowedMimeTypes.includes(mimeType)) {
      return reply.badRequest('Invalid file type!');
    }

    await ensureBucketExists(BUCKET_NAME);

    const url = await fastify.minio.presignedPutObject(BUCKET_NAME, fileName);

    reply.send({ url });
  });
};

export default getPreSignedPutURL;
