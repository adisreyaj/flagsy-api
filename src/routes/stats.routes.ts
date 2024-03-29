import { FastifyInstance } from 'fastify';
import { Permission, Scope } from '../config/rbac.config';
import { validateRbac } from '../plugins/rbac.plugin';

export const STATS_ROUTES = async (app: FastifyInstance) => {
  app.route({
    method: 'GET',
    url: '/overview',
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['USER', 'ADMIN'],
        [
          {
            scope: Scope.Feature,
            permissions: [Permission.Read],
          },
        ],
      ),
    ],
    handler: () => {},
  });
};
