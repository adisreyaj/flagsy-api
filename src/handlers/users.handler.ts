import { FastifyInstance } from 'fastify';
import { Handler } from '../types/handler.type';

export class UsersHandler {
  public constructor(private app: FastifyInstance) {
    this.app = app;
  }

  public getAll: Handler = async (_request, reply) => {
    const users = await this.app.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    reply.send(users);
  };
}
