import { FastifyInstance } from 'fastify';
import { Permission, Scope } from '../config/rbac.config';
import { ProjectsHandler } from '../handlers/projects.handler';
import { validateRbac } from '../plugins/rbac.plugin';

export const PROJECT_ROUTES = async (app: FastifyInstance) => {
  const handler = new ProjectsHandler(app);
  app.route({
    method: 'GET',
    url: '/',
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['USER', 'ADMIN'],
        [
          {
            scope: Scope.Project,
            permissions: [Permission.Read],
          },
        ],
      ),
    ],
    handler: handler.getAll,
  });

  app.route({
    method: 'POST',
    url: '/',
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['ADMIN'],
        [
          {
            scope: Scope.Project,
            permissions: [Permission.Write],
          },
        ],
      ),
    ],
    handler: handler.create,
  });
};
