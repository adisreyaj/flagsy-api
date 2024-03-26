import { FastifyInstance } from 'fastify';
import { Permission, Scope } from '../config/rbac.config';
import { StatsHandler } from '../handlers/stats.handler';
import { validateRbac } from '../plugins/rbac.plugin';

export const STATS_ROUTES = async (app: FastifyInstance) => {
  const handler = new StatsHandler(app);

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
    handler: handler.getAll,
  });
};
