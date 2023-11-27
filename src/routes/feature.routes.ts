import { FastifyInstance } from 'fastify';
import { create, getAll } from '../handlers/features.handler';

export const FEATURE_ROUTES = async (app: FastifyInstance) => {
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
