import { FastifyReply } from 'fastify';

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
}
