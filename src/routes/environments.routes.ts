import { FastifyInstance } from 'fastify';
import { EnvironmentsHandler } from '../handlers/environments.handler';
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
    preHandler: app.auth([app.validateToken]),
    handler: handler.getAll,
  });

  app.route<CreateEnvironmentRouteInterface>({
    method: 'POST',
    url: '/',
    schema: EnvironmentsSchema.createEnvironment,
    preHandler: app.auth([app.validateToken]),
    handler: handler.create,
  });
};
