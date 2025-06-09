import { FastifyPluginAsync } from 'fastify';
import { toggleLikeSchema } from '../../schemas/media';
import { LikeAction, AuthenticatedUser, ServiceError } from '../../types';
import { handleServiceError } from '../../utils/errorHandler';



const toggleLike: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/:id/toggle-like', { schema: toggleLikeSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const { action } = request.body as LikeAction;
    const user = request.user as AuthenticatedUser;

    try {
      const result = await fastify.mediaService.toggleLike(id, user.id, action);
      return reply.send(result);
    } catch (error) {
      return handleServiceError(error as ServiceError, reply);
    }
  });
};

export default toggleLike;
