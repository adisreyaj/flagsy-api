import { genSalt, hash } from 'bcryptjs';
import { FastifyInstance, FastifyReply, preHandlerHookHandler } from 'fastify';
import { ROLE_SCOPE_MAP } from '../config/rbac.config';
import { UserRole } from '../types/user.type';
import { ReqResUtil } from './reqres.util';

export abstract class AuthUtil {
  public static setCookie = (reply: FastifyReply, jwt: string) => {
    return reply.setCookie('token', jwt);
  };

  public static generateJWT = async ({
    reply,
    userId,
    orgId,
    roles = [],
    scopes = [],
  }: {
    reply: FastifyReply;
    userId: string;
    orgId: string;
    roles?: string[];
    scopes?: string[];
  }): Promise<string> => {
    return await reply.jwtSign({
      userId: userId,
      orgId: orgId,
      roles: roles,
      scopes: scopes,
    });
  };

  public static userHasAccessToFeature =
    (app: FastifyInstance): preHandlerHookHandler =>
    async (request, reply) => {
      const { featureId } = request.params as { featureId: string };

      const feature = await app.prisma.feature.findUnique({
        where: {
          id: featureId,
        },
        select: {
          id: true,
          orgId: true,
          ownerId: true,
        },
      });

      if (!feature) {
        return reply
          .status(404)
          .send(ReqResUtil.errorMessage('Feature not found'));
      }
      if (feature?.orgId !== request.user.orgId) {
        return reply
          .status(401)
          .send(
            ReqResUtil.errorMessage('No permission to access this resource'),
          );
      }
      return;
    };

  public static hashPassword = async (password: string): Promise<string> => {
    const salt = await genSalt(10);
    return await hash(password, salt);
  };

  public static getScopesForRoles = (roles: UserRole[]): string[] => {
    const flattenScope = (role: UserRole) => {
      return (ROLE_SCOPE_MAP.get(role) ?? []).reduce((acc, item) => {
        return [...acc, ...item.permissions.map((p) => `${item.scope}:${p}`)];
      }, [] as string[]);
    };

    return roles.reduce((acc, role) => {
      return [...acc, ...flattenScope(role)];
    }, [] as string[]);
  };
}
