import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

export type Handler<T extends RouteGenericInterface = RouteGenericInterface> = (
  request: FastifyRequest<T>,
  reply: FastifyReply,
) => Promise<void>;
