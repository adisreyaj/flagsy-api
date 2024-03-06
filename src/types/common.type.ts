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
