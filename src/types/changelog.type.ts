import { RouteGenericInterface } from 'fastify/types/route';
import {
  EnvironmentIdQueryParam,
  FilterQueryParam,
  PaginationQueryParam,
  ProjectIdQueryParam,
  SearchQueryParam,
  SortOrderQueryParam,
} from './common.type';

export interface GetAllChangelogRouteInterface extends RouteGenericInterface {
  Querystring: EnvironmentIdQueryParam &
    ProjectIdQueryParam &
    SortOrderQueryParam<ChangeLogSortByKey> &
    SearchQueryParam &
    PaginationQueryParam &
    FilterQueryParam;
}

export enum ChangeLogSortByKey {
  Date = 'date',
  Feature = 'feature',
}
