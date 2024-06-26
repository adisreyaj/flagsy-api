import { FastifyInstance } from 'fastify';
import { Permission, Scope } from '../config/rbac.config';
import { OrgsHandler } from '../handlers/orgs.handler';
import { validateRbac } from '../plugins/rbac.plugin';

export const ORG_ROUTES = async (app: FastifyInstance) => {
  const handler = new OrgsHandler(app);

  app.route({
    method: 'GET',
    url: '/',
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['USER', 'ADMIN'],
        [
          {
            scope: Scope.Org,
            permissions: [Permission.Read],
          },
        ],
      ),
    ],
    handler: handler.getAll,
  });
};
