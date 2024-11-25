import { FastifyPluginAsync } from 'fastify';
import { PutObjectCommand, CreateBucketCommand, HeadBucketCommand, S3ServiceException } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
  summary: 'Get a pre-signed URL for uploading a file to S3',
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
    try {
      await fastify.s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (err) {
      if ((err as S3ServiceException).$metadata.httpStatusCode === 404) {
        await fastify.s3.send(new CreateBucketCommand({ Bucket: bucketName }));
      } else {
        throw err;
      }
    }
  };

  fastify.post('/upload-url', { schema: getPreSignedPutURLSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { fileName, mimeType } = request.body as { fileName: string, mimeType: string };

    if (!allowedMimeTypes.includes(mimeType)) {
      return reply.badRequest('Invalid file type!');
    }

    await ensureBucketExists(BUCKET_NAME);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ContentType: mimeType
    });

    const url = await getSignedUrl(fastify.s3, command);

    reply.send({ url });
  });
};

export default getPreSignedPutURL;
