import { FastifyPluginAsync } from 'fastify';
import { deleteMediaSchema } from '../../schemas/media';
import { AuthenticatedUser, ServiceError } from '../../types';
import { handleServiceError } from '../../utils/errorHandler';

const deleteMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.delete('/:id', { schema: deleteMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const user = request.user as AuthenticatedUser;

    try {
      const result = await fastify.mediaService.deleteMedia(id, user.id, user.username);
      return reply.send(result);
    } catch (error) {
      return handleServiceError(error as ServiceError, reply);
    }
  });
}

export default deleteMedia;
