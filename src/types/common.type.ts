import { Prisma } from '@prisma/client';

export interface ProjectIdQueryParam {
  projectId?: string;
  projectKey?: string;
}

export interface EnvironmentIdQueryParam {
  environmentId?: string;
  environmentKey?: string;
}

export interface SortOrderQueryParam<SortKey = unknown> {
  sortBy?: SortKey;
  direction?: SortOrder;
}

export interface SearchQueryParam {
  search?: string;
}

export interface PaginationQueryParam {
  offset?: number;
  limit?: number;
}

export interface FilterQueryParam {
  filter?: string;
}

export type SortOrder = Prisma.SortOrder;
