import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from 'fastify';

export type Handler<T extends RouteGenericInterface = RouteGenericInterface> = (
  app: FastifyInstance,
) => (request: FastifyRequest<T>, reply: FastifyReply) => Promise<void>;
