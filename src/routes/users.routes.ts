import { FastifyInstance } from 'fastify';
import { getAll } from '../handlers/users.handler';

export const USER_ROUTES = async (app: FastifyInstance) => {
  app.route({
    method: 'GET',
    url: '/',
    preHandler: app.auth([app.validateToken]),
    handler: getAll(app),
  });
};
