import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; orgId: string };
  }
}

const validateTokenPlugin: FastifyPluginAsync = fp(async (server) => {
  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies?.token;
    if (!token) {
      return reply.status(401).send({
        message: 'Unauthorized',
      });
    }

    try {
      await request.jwtVerify({
        onlyCookie: true,
      });
    } catch (err) {
      return reply.status(401).send({
        message: 'Unauthorized',
      });
    }
  };

  server.decorate('validateToken', authenticate);
});

export { validateTokenPlugin };
