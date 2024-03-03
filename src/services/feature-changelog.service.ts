import { Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';

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

  public async logUpdateFeature(data: UpdateFeatureLogArgs) {
    return this.app.prisma.featureChangeLog.create({
      data: {
        featureId: data.featureId,
        environmentId: data.environmentId,
        ownerId: data.ownerId,
        change: data.changeData,
      },
    });
  }
}

export interface UpdateFeatureLogArgs {
  environmentId: string;
  featureId: string;
  ownerId: string;
  changeData: Prisma.InputJsonValue;
}
