import { FastifyPluginAsync } from 'fastify';
import { getAllMediaSchema } from '../../schemas/media';
import { PaginationParams, AuthenticatedUser, ServiceError } from '../../types';
import { handleServiceError } from '../../utils/errorHandler';

const getAllMedia: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', { schema: getAllMediaSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
    const user = request.user as AuthenticatedUser;
    const { page = 1, limit = 10 } = request.query as PaginationParams;

    try {
      const result = await fastify.mediaService.getAllMediaPaginated(page, limit, user.id, user.username);

      if (result.data.length === 0 && page === 1) {
        return reply.status(204).send();
      }

      return reply.send(result);
    } catch (error) {
      return handleServiceError(error as ServiceError, reply);
    }
  });
};

export default getAllMedia;
