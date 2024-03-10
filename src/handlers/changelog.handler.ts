import { Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import {
  ChangeLogSortByKey,
  GetAllChangelogRouteInterface,
} from '../types/changelog.type';
import { Handler } from '../types/handler.type';

export class ChangelogHandler {
  public constructor(private readonly app: FastifyInstance) {
    this.app = app;
  }

  public getAll: Handler<GetAllChangelogRouteInterface> = async (
    request,
    reply,
  ) => {
    const { sortBy, direction } = request.query;
    const getOrderBy = (
      sortBy?: ChangeLogSortByKey,
      direction?: string,
    ): Prisma.FeatureChangeLogOrderByWithRelationInput => {
      switch (sortBy) {
        case ChangeLogSortByKey.Date:
          return { createdAt: direction as Prisma.SortOrder };
        case ChangeLogSortByKey.Feature:
          return {
            feature: {
              key: direction as Prisma.SortOrder,
            },
          };
        default:
          return {};
      }
    };

    const [changeLogs, total] = await this.app.prisma.$transaction([
      this.app.prisma.featureChangeLog.findMany({
        select: {
          feature: {
            select: {
              id: true,
              key: true,
            },
          },
          environment: {
            select: {
              id: true,
              key: true,
              name: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          change: true,
          createdAt: true,
          type: true,
        },
        orderBy: getOrderBy(sortBy, direction),
      }),
      this.app.prisma.featureChangeLog.count({}),
    ]);

    reply.send({
      data: changeLogs,
      total,
    });
  };
}
