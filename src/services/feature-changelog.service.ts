import { Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { FeatureChangeLogType } from '.prisma/client';

export class FeatureChangelogService {
  public constructor(private app: FastifyInstance) {
    this.app = app;
  }

  public async getFeatureChangelog(featureId: string, environmentId?: string) {
    return this.app.prisma.featureChangeLog.findMany({
      where: {
        featureId,
        environmentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        change: true,
        createdAt: true,
        feature: {
          select: {
            id: true,
            key: true,
            description: true,
          },
        },
        environment: {
          select: {
            key: true,
            id: true,
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
      },
    });
  }

  public async logCreateFeature(data: UpdateFeatureLogArgs) {
    return this.app.prisma.featureChangeLog.create({
      data: {
        featureId: data.featureId,
        ownerId: data.ownerId,
        change: data.changeData ?? Prisma.JsonNull,
        type: FeatureChangeLogType.CREATE,
      },
    });
  }

  public async logDeleteFeature(data: UpdateFeatureLogArgs) {
    return this.app.prisma.featureChangeLog.create({
      data: {
        featureId: data.featureId,
        ownerId: data.ownerId,
        change: data.changeData ?? Prisma.JsonNull,
        type: FeatureChangeLogType.DELETE,
      },
    });
  }

  public async logUpdateFeature(data: UpdateFeatureLogArgs) {
    return this.app.prisma.featureChangeLog.create({
      data: {
        featureId: data.featureId,
        environmentId: data.environmentId,
        ownerId: data.ownerId,
        change: data.changeData ?? Prisma.JsonNull,
        type: FeatureChangeLogType.VALUE_CHANGE,
      },
    });
  }
}

export interface UpdateFeatureLogArgs {
  environmentId?: string;
  featureId: string;
  ownerId: string;
  changeData?: Prisma.InputJsonValue;
}
