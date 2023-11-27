import { FeatureValueType } from '@prisma/client';
import { RouteGenericInterface } from 'fastify/types/route';
import { EnvironmentIdQueryParam, ProjectIdQueryParam } from './common.type';

export interface FeatureCreateData {
  key: string;
  projectId: string;
  valueType: FeatureValueType;
  value: never;
  environmentOverrides: {
    environmentId: string;
    value: never;
  }[];
}

export interface GetAllFeaturesRouteInterface extends RouteGenericInterface {
  Querystring: EnvironmentIdQueryParam & ProjectIdQueryParam;
}
