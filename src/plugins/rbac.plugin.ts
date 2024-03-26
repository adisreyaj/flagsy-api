import { preHandlerHookHandler } from 'fastify';
import {
  CombinedScopeAndPermission,
  ScopeWithAssociatedPermissions,
} from '../config/rbac.config';
import { UserRole } from '../types/user.type';

export const validateRbac = (
  roles: UserRole[],
  scopes: ScopeWithAssociatedPermissions[],
): preHandlerHookHandler => {
  return (request, reply, done) => {
    const userScopesSet = new Set(request.user.scopes ?? []);

    const requiredRoles = roles;
    const requiredScopesWithPermissions = scopes.flatMap((scope) => {
      return scope.permissions.map(
        (permission) =>
          `${scope.scope}:${permission}` as CombinedScopeAndPermission,
      );
    });

    const hasScope = requiredScopesWithPermissions.every((scope) =>
      userScopesSet.has(scope),
    );

    if (!hasScope) {
      reply.log.info({
        user: {
          orgId: request.user.orgId,
          userId: request.user.userId,
        },
        reason: 'No permission to access this resource',
        requiredScopes: requiredScopesWithPermissions,
      });
      return reply.status(401).send({
        message: 'No permission to access this resource',
      });
    }

    request.requiredRoles = requiredRoles;
    request.requiredScopes = requiredScopesWithPermissions;
    done();
  };
};
