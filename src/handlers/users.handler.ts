import { FastifyInstance } from 'fastify';
import { randomBytes } from 'node:crypto';
import { Handler } from '../types/handler.type';
import { AddUserToOrgRouteInterface } from '../types/user.type';

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

  public addUserToOrg: Handler<AddUserToOrgRouteInterface> = async (
    request,
    reply,
  ) => {
    const { email, firstName, lastName, role, orgId } = request.body;
    const user = await this.app.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        orgs: {
          connect: {
            id: orgId,
          },
        },
        role,
        password: randomBytes(32).toString('hex'),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    reply.send(user);
  };
}
