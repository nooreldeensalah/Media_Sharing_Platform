import { FastifyPluginAsync } from 'fastify';
import { registerSchema, loginSchema } from '../../schemas/users';
import { ServiceError } from '../../types';
import { handleServiceError } from '../../utils/errorHandler';




const users: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/register', { schema: registerSchema }, async (request, reply) => {
    const { username, password } = request.body as { username: string, password: string };

    try {
      const result = await fastify.userService.registerUser(username, password);
      return reply.send(result);
    } catch (error) {
      return handleServiceError(error as ServiceError, reply);
    }
  });

  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { username, password } = request.body as { username: string, password: string };

    try {
      const result = await fastify.userService.loginUser(username, password);
      return reply.send(result);
    } catch (error) {
      return handleServiceError(error as ServiceError, reply);
    }
  });
};

export default users;
