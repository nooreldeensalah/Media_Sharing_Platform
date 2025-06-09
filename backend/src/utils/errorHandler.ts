import { FastifyReply } from 'fastify';
import { ServiceError } from '../types';

export const handleServiceError = (error: ServiceError, reply: FastifyReply) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  switch (statusCode) {
    case 400:
      return reply.badRequest(message);
    case 401:
      return reply.unauthorized(message);
    case 403:
      return reply.forbidden(message);
    case 404:
      return reply.notFound(message);
    case 500:
    default:
      return reply.internalServerError(message);
  }
};

export const createServiceError = (message: string, statusCode: number = 500): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};
