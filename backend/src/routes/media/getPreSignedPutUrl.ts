import { FastifyPluginAsync } from 'fastify'

const getPreSignedPutURLSchema = {
  tags: ["media"],
  body: {
    type: 'object',
    required: ['fileName'],
    properties: {
      fileName: { type: 'string' }
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

  fastify.post('/upload-url', { schema: getPreSignedPutURLSchema }, async (request, reply) => {
    const { fileName } = request.body as { fileName: string };

    const url = await fastify.minio.presignedPutObject(BUCKET_NAME, fileName);

    reply.send({ url });
  });
};

export default getPreSignedPutURL;
