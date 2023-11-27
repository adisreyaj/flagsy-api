import { FastifyInstance } from 'fastify';
import { create, getAll } from '../handlers/environments.handler';
import { EnvironmentsSchema } from '../schema/environments.schema';
import {
  CreateEnvironmentRouteInterface,
  GetAllEnvironmentRouteInterface,
} from '../types/environments.type';

export const ENVIRONMENT_ROUTES = async (app: FastifyInstance) => {
  app.route<GetAllEnvironmentRouteInterface>({
    method: 'GET',
    url: '/',
    schema: EnvironmentsSchema.getAllEnvironments,
    preHandler: app.auth([app.validateToken]),
    handler: getAll(app),
  });

  app.route<CreateEnvironmentRouteInterface>({
    method: 'POST',
    url: '/',
    schema: EnvironmentsSchema.createEnvironment,
    preHandler: app.auth([app.validateToken]),
    handler: create(app),
  });
};
