import { FastifyInstance } from 'fastify';
import { login, register } from '../handlers/auth.handler';

export const AUTH_ROUTES = async (app: FastifyInstance) => {
  app.route({
    method: 'POST',
    url: '/register',
    handler: register(app),
  });

  app.route({
    method: 'POST',
    url: '/login',
    handler: login(app),
  });
};
