import { Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { omit } from 'lodash';
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
    const [projects, total] = await this.app.prisma.$transaction([
      this.app.prisma.project.findMany({
        where: {
          org: {
            id: request.user.orgId,
          },
        },
        select: {
          id: true,
          name: true,
          key: true,
          description: true,
          _count: {
            select: {
              features: true,
              environments: true,
            },
          },
          org: {
            select: {
              id: true,
              key: true,
              name: true,
            },
          },
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          createdAt: true,
        },
      }),
      this.app.prisma.project.count({
        where: {
          ownerId: request.user.userId,
        },
      }),
    ]);
    reply.send({
      data: projects.map((project) => ({
        ...omit(project, '_count'),
        count: project._count,
      })),
      total,
    });
  };
}
