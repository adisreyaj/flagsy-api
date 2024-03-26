import { FastifyInstance } from 'fastify';
import { Permission, Scope } from '../config/rbac.config';
import { ChangelogHandler } from '../handlers/changelog.handler';
import { validateRbac } from '../plugins/rbac.plugin';

export const CHANGELOG_ROUTES = async (app: FastifyInstance) => {
  const handler = new ChangelogHandler(app);
  app.route({
    method: 'GET',
    url: '/',
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['ADMIN'],
        [
          {
            scope: Scope.ChangeLog,
            permissions: [Permission.Read],
          },
        ],
      ),
    ],
    handler: handler.getAll,
  });
};
