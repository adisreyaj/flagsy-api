import { genSalt, hash } from 'bcryptjs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ROLE_SCOPE_MAP } from '../config/rbac.config';
import { UserRole } from '../types/user.type';

export abstract class AuthUtil {
  public static setCookie = (reply: FastifyReply, jwt: string) => {
    return reply.setCookie('token', jwt);
  };

  public static generateJWT = async (
    reply: FastifyReply,
    userId: string,
    orgId: string,
    roles: string[] = [],
    scopes: string[] = [],
  ): Promise<string> => {
    return await reply.jwtSign({
      userId: userId,
      orgId: orgId,
      roles: roles,
      scopes: scopes,
    });
  };

  public static userHasAccessToFeature =
    (app: FastifyInstance) =>
    async (request: FastifyRequest, reply: FastifyReply) => {
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
        return reply.status(404).send(new Error('Feature not found'));
      }
      if (
        feature?.orgId !== request.user.orgId ||
        feature?.ownerId !== request.user.userId
      ) {
        return reply.status(401).send(new Error('Unauthorized'));
      }
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
