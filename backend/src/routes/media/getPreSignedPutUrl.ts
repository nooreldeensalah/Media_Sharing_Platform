import { FastifyPluginAsync } from 'fastify';
import { getPreSignedPutURLSchema } from '../../schemas/media';
import { UploadNotification, ServiceError } from '../../types';
import { handleServiceError } from '../../utils/errorHandler';

const getPreSignedPutURL: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/upload-url', { schema: getPreSignedPutURLSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { fileName, mimeType } = request.body as UploadNotification;

    try {
      const result = await fastify.mediaService.generateUploadUrl(fileName, mimeType);
      return reply.send(result);
    } catch (error) {
      return handleServiceError(error as ServiceError, reply);
    }
  });
};

export default getPreSignedPutURL;
