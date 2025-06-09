import { FastifyPluginAsync } from 'fastify';
import { getMediaSchema } from '../../schemas/media';
import { AuthenticatedUser, ServiceError } from '../../types';
import { handleServiceError } from '../../utils/errorHandler';


const getMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/:id', { schema: getMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const user = request.user as AuthenticatedUser;

    try {
      const mediaItem = await fastify.mediaService.getMediaById(id, user.id, user.username);
      return reply.send(mediaItem);
    } catch (error) {
      return handleServiceError(error as ServiceError, reply);
    }
  });
}

export default getMedia;
