import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export abstract class AuthUtil {
  public static setCookie = (reply: FastifyReply, jwt: string) => {
    return reply.setCookie('token', jwt);
  };

  public static generateJWT = async (
    reply: FastifyReply,
    userId: string,
    orgId: string,
  ): Promise<string> => {
    return await reply.jwtSign({
      userId: userId,
      orgId: orgId,
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
}
