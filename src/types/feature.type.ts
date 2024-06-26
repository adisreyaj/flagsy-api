import { FeatureValueType, Prisma } from '@prisma/client';
import { RouteGenericInterface } from 'fastify/types/route';
import {
  EnvironmentIdQueryParam,
  PaginationQueryParam,
  ProjectIdQueryParam,
  SearchQueryParam,
  SortOrder,
  SortOrderQueryParam,
} from './common.type';

export interface FeatureCreateData {
  key: string;
  projectId: string;
  value: Prisma.InputJsonValue;
  environmentOverrides: {
    environmentId: string;
    value: never;
  }[];
  valueType: FeatureValueType;
  description: string;
}

export type FeatureUpdateData = Omit<
  FeatureCreateData,
  'environmentOverrides'
> & {
  environmentId?: string;
};

export interface GetAllFeaturesRouteInterface extends RouteGenericInterface {
  Querystring: EnvironmentIdQueryParam &
    ProjectIdQueryParam &
    SearchQueryParam &
    SortOrderQueryParam<FeatureSortBy> &
    PaginationQueryParam;
}

export interface GetFeatureChangeLogRouteInterface
  extends RouteGenericInterface {
  Params: {
    featureId: string;
  };
}

export interface GetAllFeaturesPublicRouteInterface
  extends RouteGenericInterface {
  Querystring: {
    sortBy?: FeatureSortBy;
    sortOrder?: SortOrder;
    search?: string;
  };
}

export interface CreateFeatureRouteInterface extends RouteGenericInterface {
  Body: FeatureCreateData;
}
export interface UpdateFeatureRouteInterface extends RouteGenericInterface {
  Body: FeatureUpdateData;
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
