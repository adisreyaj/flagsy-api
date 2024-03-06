import { RouteGenericInterface } from 'fastify/types/route';
import {
  EnvironmentIdQueryParam,
  ProjectIdQueryParam,
  SortOrder,
} from './common.type';

export interface GetAllChangelogRouteInterface extends RouteGenericInterface {
  Querystring: EnvironmentIdQueryParam &
    ProjectIdQueryParam & {
      sortBy?: ChangeLogSortByKey;
      direction?: SortOrder;
      search?: string;
    };
}

export enum ChangeLogSortByKey {
  Date = 'date',
  Feature = 'feature',
}
