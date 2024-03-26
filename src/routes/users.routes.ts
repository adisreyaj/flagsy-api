import { FastifyInstance } from 'fastify';
import { UsersHandler } from '../handlers/users.handler';
import { UserSchema } from '../schema/user.schema';

export const USER_ROUTES = async (app: FastifyInstance) => {
  const handler = new UsersHandler(app);

  app.route({
    method: 'GET',
    url: '/',
    schema: UserSchema.getAllUsers,
    preHandler: app.auth([app.validateToken]),
    handler: handler.getAll,
  });

  app.route({
    method: 'POST',
    url: '/invite',
    schema: UserSchema.addUserToOrg,
    preHandler: app.auth([app.validateToken]),
    handler: handler.addUserToOrg,
  });
};
