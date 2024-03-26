import { UserRole } from '../types/user.type';

export enum Scope {
  Feature = 'feature',
  Org = 'org',
  User = 'user',
  Project = 'project',
  Environment = 'environment',
  ChangeLog = 'changelog',
}

export enum Permission {
  Write = 'write',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export interface ScopeWithAssociatedPermissions {
  scope: Scope;
  permissions: Permission[];
}

export type CombinedScopeAndPermission = `${Scope}:${Permission}`;

export const ROLE_SCOPE_MAP = new Map<
  UserRole,
  ScopeWithAssociatedPermissions[]
>([
  [
    'ADMIN',
    [
      {
        scope: Scope.Feature,
        permissions: [
          Permission.Write,
          Permission.Read,
          Permission.Update,
          Permission.Delete,
        ],
      },
      {
        scope: Scope.Org,
        permissions: [
          Permission.Write,
          Permission.Read,
          Permission.Update,
          Permission.Delete,
        ],
      },
      {
        scope: Scope.User,
        permissions: [
          Permission.Write,
          Permission.Read,
          Permission.Update,
          Permission.Delete,
        ],
      },
      {
        scope: Scope.Project,
        permissions: [
          Permission.Write,
          Permission.Read,
          Permission.Update,
          Permission.Delete,
        ],
      },
      {
        scope: Scope.Environment,
        permissions: [Permission.Write, Permission.Read],
      },
      {
        scope: Scope.ChangeLog,
        permissions: [Permission.Read],
      },
    ],
  ],
  [
    'USER',
    [
      {
        scope: Scope.Environment,
        permissions: [Permission.Read],
      },
      {
        scope: Scope.Project,
        permissions: [Permission.Read],
      },
      {
        scope: Scope.Feature,
        permissions: [Permission.Read],
      },
      {
        scope: Scope.Org,
        permissions: [Permission.Read],
      },
      {
        scope: Scope.User,
        permissions: [Permission.Read],
      },
      {
        scope: Scope.ChangeLog,
        permissions: [Permission.Read],
      },
    ],
  ],
]);
