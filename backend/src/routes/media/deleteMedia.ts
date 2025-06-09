import { FastifyPluginAsync } from 'fastify';
import { deleteMediaSchema } from '../../schemas/media';
import { AuthenticatedUser, ServiceError, DatabaseMediaItem } from '../../types';
import { handleServiceError } from '../../utils/errorHandler';

const deleteMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.delete('/:id', { schema: deleteMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const user = request.user as AuthenticatedUser;

    try {
      // Get media info first to check ownership and get file name
      const row = fastify.sqlite.prepare('SELECT * FROM media WHERE id = ?').get(id) as DatabaseMediaItem | undefined;

      if (!row) {
        return reply.notFound('File not found in database');
      }

      if (row.created_by !== user.username) {
        return reply.forbidden('You do not have permission to delete this file');
      }

      // Delete from S3 first
      await fastify.s3Service.deleteFile(row.file_name);

      // Then delete from database
      const result = await fastify.mediaService.deleteMedia(id, user.id, user.username);
      return reply.send(result);
    } catch (error) {
      return handleServiceError(error as ServiceError, reply);
    }
  });
}

export default deleteMedia;
