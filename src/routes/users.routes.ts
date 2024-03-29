import { FastifyInstance } from 'fastify';
import { Permission, Scope } from '../config/rbac.config';
import { UsersHandler } from '../handlers/users.handler';
import { validateRbac } from '../plugins/rbac.plugin';
import { UserSchema } from '../schema/user.schema';

export const USER_ROUTES = async (app: FastifyInstance) => {
  const handler = new UsersHandler(app);

  app.route({
    method: 'GET',
    url: '/',
    schema: UserSchema.getAllUsers,
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['USER', 'ADMIN'],
        [
          {
            scope: Scope.User,
            permissions: [Permission.Read],
          },
        ],
      ),
    ],
    handler: handler.getAll,
  });

  app.route({
    method: 'POST',
    url: '/invite',
    schema: UserSchema.addUserToOrg,
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['ADMIN'],
        [
          {
            scope: Scope.User,
            permissions: [Permission.Write],
          },
        ],
      ),
    ],
    handler: handler.addUserToOrg,
  });
};
