import { FastifyInstance } from 'fastify';
import { AuthHandler } from '../handlers/auth.handler';
import { UserSchema } from '../schema/user.schema';

export const AUTH_ROUTES = async (app: FastifyInstance) => {
  const handler = new AuthHandler(app);

  app.route({
    method: 'POST',
    url: '/register',
    schema: UserSchema.createUser,
    handler: handler.register,
  });

  app.route({
    method: 'POST',
    url: '/login',
    schema: UserSchema.login,
    handler: handler.login,
  });

  app.route({
    method: 'GET',
    url: '/me',
    schema: UserSchema.me,
    preHandler: app.auth([app.validateToken]),
    handler: handler.me,
  });

  app.route({
    method: 'GET',
    url: '/logout',
    preHandler: app.auth([app.validateToken]),
    handler: handler.logout,
  });

  app.route({
    method: 'POST',
    url: '/update-password',
    schema: UserSchema.updatePassword,
    preHandler: app.auth([app.validateToken]),
    handler: handler.updatePassword,
  });
};
