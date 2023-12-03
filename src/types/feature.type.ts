import { FeatureValueType } from '@prisma/client';
import { RouteGenericInterface } from 'fastify/types/route';
import {
  EnvironmentIdQueryParam,
  ProjectIdQueryParam,
  SortOrder,
} from './common.type';

export interface FeatureCreateData {
  key: string;
  projectId: string;
  value: never;
  environmentOverrides: [
    {
      environmentId: string;
      value: never;
    },
  ];
  valueType: FeatureValueType;
  description: string;
}

export interface GetAllFeaturesRouteInterface extends RouteGenericInterface {
  Querystring: EnvironmentIdQueryParam &
    ProjectIdQueryParam & {
      sortBy?: FeatureSortBy;
      sortOrder?: SortOrder;
      search?: string;
    };
}

export interface CreateFeatureRouteInterface extends RouteGenericInterface {
  Body: FeatureCreateData;
}

export interface DeleteFeatureRouteInterface extends RouteGenericInterface {
  Params: {
    featureId: string;
  };
}

export enum FeatureSortBy {
  Key = 'key',
  LastUpdated = 'updatedAt',
}
