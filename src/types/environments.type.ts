import { RouteGenericInterface } from 'fastify/types/route';
import { ProjectIdQueryParam } from './common.type';

export interface GetAllEnvironmentRouteInterface extends RouteGenericInterface {
  Querystring: ProjectIdQueryParam;
}

export interface CreateEnvironmentRouteInterface extends RouteGenericInterface {
  Body: {
    name: string;
    key: string;
    projectId: string;
  };
}
