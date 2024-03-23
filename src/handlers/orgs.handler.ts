import { FastifyInstance } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { omit } from 'lodash';
import { Handler } from '../types/handler.type';

export class OrgsHandler {
  public constructor(private readonly app: FastifyInstance) {
    this.app = app;
  }

  getAll: Handler<RouteGenericInterface> = async (_request, reply) => {
    const [orgs, total] = await this.app.prisma.$transaction([
      this.app.prisma.org.findMany({
        select: {
          id: true,
          name: true,
          key: true,
          createdAt: true,
          _count: {
            select: {
              members: true,
              projects: true,
              environments: true,
              features: true,
            },
          },
        },
      }),
      this.app.prisma.org.count(),
    ]);

    reply.send({
      data: orgs.map((org) => ({
        ...omit(org, '_count'),
        count: org._count,
      })),
      total,
    });
  };
}
