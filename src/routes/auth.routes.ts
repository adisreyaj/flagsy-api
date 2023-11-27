import { FastifyInstance } from 'fastify';
import { login, logout, me, register } from '../handlers/auth.handler';

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

  app.route({
    method: 'GET',
    url: '/me',
    preHandler: app.auth([app.validateToken]),
    handler: me(app),
  });

  app.route({
    method: 'GET',
    url: '/logout',
    preHandler: app.auth([app.validateToken]),
    handler: logout(app),
  });
};
