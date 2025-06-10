import { FastifyPluginAsync } from "fastify";
import { notifyUploadSchema } from '../../schemas/media';
import { UploadNotification, AuthenticatedUser, ServiceError } from '../../types';
import { handleServiceError } from '../../utils/errorHandler';



const notifyUpload: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/notify-upload', { schema: notifyUploadSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { fileName, mimeType, originalFilename } = request.body as UploadNotification;
    const user = request.user as AuthenticatedUser;

    try {
      // Verify the file exists in S3 before storing in database
      await fastify.s3Service.verifyFileExists(fileName);

      // Store media metadata in database
      const result = await fastify.mediaService.notifyUpload(fileName, mimeType, user.username, originalFilename);
      return reply.send(result);
    } catch (error) {
      return handleServiceError(error as ServiceError, reply);
    }
  });
};

export default notifyUpload;
