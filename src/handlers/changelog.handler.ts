import { $Enums } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { isEmpty } from 'lodash';
import {
  ChangeLogSortByKey,
  GetAllChangelogRouteInterface,
} from '../types/changelog.type';
import { Handler } from '../types/handler.type';
import { QueryParamParseUtil } from '../util/query-param-parse.util';
import { FeatureChangeLogType } from '.prisma/client';

export class ChangelogHandler {
  public constructor(private readonly app: FastifyInstance) {
    this.app = app;
  }

  public getAll: Handler<GetAllChangelogRouteInterface> = async (
    request,
    reply,
  ) => {
    const { sort, pagination, filters } = QueryParamParseUtil.parse(
      request.query,
      {
        sortKeyTransform: (key: string) => {
          switch (key) {
            case ChangeLogSortByKey.Date:
              return 'createdAt';
            case ChangeLogSortByKey.Feature:
              return 'feature';
            default:
              return key;
          }
        },
      },
    );

    const [changeLogs, total] = await this.app.prisma.$transaction([
      this.app.prisma.featureChangeLog.findMany({
        where: {
          orgId: request.user.orgId,
          ...(filters?.['environment'] !== undefined
            ? {
                environment: {
                  id: {
                    in: filters?.['environment'],
                  },
                },
              }
            : {}),
          ...(filters?.['type'] !== undefined
            ? {
                type: {
                  in: filters?.['type'] as $Enums.FeatureChangeLogType[],
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
        ...(!isEmpty(sort)
          ? {
              orderBy: {
                [sort.sortBy]: sort.direction,
              },
            }
          : {}),
        skip: pagination.offset,
        take: pagination.limit,
      }),
      this.app.prisma.featureChangeLog.count({
        where: {
          orgId: request.user.orgId,
          ...(filters?.['environmentIds'] !== undefined
            ? {
                environment: {
                  id: {
                    in: filters?.['environmentIds'],
                  },
                },
              }
            : {}),
          ...(filters?.['types'] !== undefined
            ? {
                type: {
                  in: filters?.['environmentIds'] as FeatureChangeLogType[],
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
