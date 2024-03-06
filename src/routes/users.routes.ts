import { FastifyInstance } from 'fastify';
import { UsersHandler } from '../handlers/users.handler';

export const USER_ROUTES = async (app: FastifyInstance) => {
  const handler = new UsersHandler(app);

  app.route({
    method: 'GET',
    url: '/',
    preHandler: app.auth([app.validateToken]),
    handler: handler.getAll,
  });
};
