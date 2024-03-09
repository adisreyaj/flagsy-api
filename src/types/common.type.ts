export interface ProjectIdQueryParam {
  projectId?: string;
  projectKey?: string;
}

export interface EnvironmentIdQueryParam {
  environmentId?: string;
  environmentKey?: string;
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
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
