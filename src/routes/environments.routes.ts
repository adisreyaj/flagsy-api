import { FastifyInstance } from 'fastify';
import { Permission, Scope } from '../config/rbac.config';
import { EnvironmentsHandler } from '../handlers/environments.handler';
import { validateRbac } from '../plugins/rbac.plugin';
import { EnvironmentsSchema } from '../schema/environments.schema';
import {
  CreateEnvironmentRouteInterface,
  GetAllEnvironmentRouteInterface,
} from '../types/environments.type';

export const ENVIRONMENT_ROUTES = async (app: FastifyInstance) => {
  const handler = new EnvironmentsHandler(app);
  app.route<GetAllEnvironmentRouteInterface>({
    method: 'GET',
    url: '/',
    schema: EnvironmentsSchema.getAllEnvironments,
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['USER', 'ADMIN'],
        [
          {
            scope: Scope.Environment,
            permissions: [Permission.Read],
          },
        ],
      ),
    ],
    handler: handler.getAll,
  });

  app.route<CreateEnvironmentRouteInterface>({
    method: 'POST',
    url: '/',
    schema: EnvironmentsSchema.createEnvironment,
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['ADMIN'],
        [
          {
            scope: Scope.Environment,
            permissions: [Permission.Write],
          },
        ],
      ),
    ],
    handler: handler.create,
  });
};
