import { RouteGenericInterface } from 'fastify/types/route';
import { AccessKeyType } from '.prisma/client';

export interface CreateAccessKeyRouteInterface extends RouteGenericInterface {
  Body: {
    type: AccessKeyType;
    projectId: string;
    organizationId: string;
    environmentId: string;
  };
}
