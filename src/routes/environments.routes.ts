import { FastifyInstance } from 'fastify';
import { create, getAll } from '../handlers/environments.handler';

export const ENVIRONMENT_ROUTES = async (app: FastifyInstance) => {
  app.route({
    method: 'GET',
    url: '/',
    preHandler: app.auth([app.validateToken]),
    handler: getAll(app),
  });

  app.route({
    method: 'POST',
    url: '/',
    preHandler: app.auth([app.validateToken]),
    handler: create(app),
  });
};
