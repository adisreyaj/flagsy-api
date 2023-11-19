import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export type Handler = (
  app: FastifyInstance,
) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
