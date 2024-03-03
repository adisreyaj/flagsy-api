import { FastifyRequest, RouteGenericInterface } from 'fastify';
import { AccessKeyType } from '.prisma/client';

export interface FastifyRequestWithAccessKey<
  T extends RouteGenericInterface = RouteGenericInterface,
> extends FastifyRequest<T> {
  accessKey?: {
    id: string;
    key: string;
    type: AccessKeyType;
    projectId: string;
    orgId: string;
    environmentId: string;
  };
}
