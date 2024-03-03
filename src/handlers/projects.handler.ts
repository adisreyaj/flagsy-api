import { Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { Handler } from '../types/handler.type';

export class ProjectsHandler {
  public constructor(private app: FastifyInstance) {
    this.app = app;
  }

  public create: Handler = async (request, reply) => {
    const { name, key } = request.body as Prisma.ProjectUncheckedCreateInput;
    const project = await this.app.prisma.project.create({
      data: {
        name,
        key,
        ownerId: request.user.userId,
        orgId: request.user.orgId,
      },
      select: {
        id: true,
      },
    });
    reply.send(project);
  };

  public getAll: Handler = async (request, reply) => {
    const projects = await this.app.prisma.project.findMany({
      where: {
        ownerId: request.user.userId,
      },
      select: {
        id: true,
        name: true,
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    reply.send(projects);
  };
}
