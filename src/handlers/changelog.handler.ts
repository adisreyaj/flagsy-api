import { $Enums, Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import queryString from 'query-string-esm';
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
    const { sortBy, direction, offset, limit, filter } = request.query;

    const { environment, type } = queryString.parse(filter ?? '', {
      arrayFormat: 'separator',
      arrayFormatSeparator: ':',
      decode: true,
    });

    const environmentIds: string[] | undefined =
      environment != undefined
        ? Array.isArray(environment)
          ? environment
          : [environment]
        : undefined;

    const types: string[] | undefined =
      type != undefined ? (Array.isArray(type) ? type : [type]) : undefined;

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
        where: {
          ...(environmentIds !== undefined
            ? {
                environment: {
                  id: {
                    in: environmentIds,
                  },
                },
              }
            : {}),
          ...(types !== undefined
            ? {
                type: {
                  in: types as $Enums.FeatureChangeLogType[],
                },
              }
            : {}),
        },
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
        skip: offset,
        take: limit,
      }),
      this.app.prisma.featureChangeLog.count({
        where: {
          ...(environmentIds !== undefined
            ? {
                environment: {
                  id: {
                    in: environmentIds,
                  },
                },
              }
            : {}),
        },
      }),
    ]);

    reply.send({
      data: changeLogs,
      total,
    });
  };
}
