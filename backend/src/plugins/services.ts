import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { MediaService, UserService, S3Service } from '../services';

declare module 'fastify' {
  interface FastifyInstance {
    mediaService: MediaService;
    userService: UserService;
    s3Service: S3Service;
  }
}

const servicesPlugin: FastifyPluginAsync = async (fastify, options) => {
  // Register services
  const mediaService = new MediaService(fastify);
  const userService = new UserService(fastify);
  const s3Service = new S3Service(fastify);

  fastify.decorate('mediaService', mediaService);
  fastify.decorate('userService', userService);
  fastify.decorate('s3Service', s3Service);
};

export default fp(servicesPlugin, {
  name: 'services-plugin',
  dependencies: ['sqlite', 's3', 'jwt']
});
