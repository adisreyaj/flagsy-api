import { Prisma } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { FeatureChangelogService } from '../services/feature-changelog.service';
import { SortOrder } from '../types/common.type';
import {
  CreateFeatureRouteInterface,
  DeleteFeatureRouteInterface,
  FeatureSortBy,
  GetAllFeaturesPublicRouteInterface,
  GetAllFeaturesRouteInterface,
  GetFeatureChangeLogRouteInterface,
  UpdateFeatureRouteInterface,
} from '../types/feature.type';
import { Handler } from '../types/handler.type';
import { FastifyRequestWithAccessKey } from '../types/public-api.type';
import { FeatureChangelogUtil } from '../util/feature-changelog.util';
import { FeatureChangeLogType } from '.prisma/client';

export class FeaturesHandler {
  #changeLogService: FeatureChangelogService;
  public constructor(private readonly app: FastifyInstance) {
    this.app = app;
    this.#changeLogService = new FeatureChangelogService(this.app);
  }
  public create: Handler<CreateFeatureRouteInterface> = async (
    request,
    reply,
  ) => {
    const {
      projectId,
      key,
      value,
      description,
      valueType: type,
      environmentOverrides,
    } = request.body;

    try {
      const feature = await this.app.prisma.$transaction(async () => {
        const feature = await this.app.prisma.feature.create({
          data: {
            projectId,
            key,
            type,
            value,
            ownerId: request.user.userId,
            orgId: request.user.orgId,
            description,
            environmentOverrides: {
              createMany: {
                data: (environmentOverrides ?? []).map((override) => {
                  return {
                    environmentId: override.environmentId,
                    value: override.value as Prisma.InputJsonValue,
                  };
                }),
                skipDuplicates: true,
              },
            },
          },
          select: {
            id: true,
          },
        });

        await this.#changeLogService.logCreateFeature({
          featureId: feature.id,
          ownerId: request.user.userId,
        });
        return feature;
      });

      reply.status(201).send({
        feature: {
          id: feature.id,
        },
      });
    } catch (e) {
      this.app.log.error(e);
      reply.status(500).send({
        message: 'Failed to create feature!',
      });
    }
  };

  public update: Handler<UpdateFeatureRouteInterface> = async (
    request,
    reply,
  ) => {
    const { value, description, environmentId } = request.body;
    const { featureId } = request.params as { featureId: string };

    try {
      const savedFeature = await this.app.prisma.feature.findUnique({
        where: {
          id: featureId,
        },
        select: {
          id: true,
          key: true,
          value: true,
          environmentOverrides: {
            where: {
              environmentId: environmentId,
            },
            select: {
              value: true,
            },
          },
        },
      });

      if (!savedFeature) {
        return reply.status(404).send({
          message: 'Feature not found!',
        });
      }

      const updatedFeature = await this.app.prisma.feature.update({
        where: {
          id: featureId,
          ownerId: request.user.userId,
        },
        data: {
          key: savedFeature.key, // To make sure `updatedAt` is updated
          ...(description !== undefined ? { description } : {}),
          ...(environmentId !== undefined
            ? {
                environmentOverrides: {
                  upsert: {
                    where: {
                      environmentId_featureId: {
                        environmentId: environmentId,
                        featureId: featureId,
                      },
                    },
                    update: {
                      environment: {
                        connect: {
                          id: environmentId,
                        },
                      },
                      value: value as Prisma.InputJsonValue,
                    },
                    create: {
                      environment: {
                        connect: {
                          id: environmentId,
                        },
                      },
                      value: value as Prisma.InputJsonValue,
                    },
                  },
                },
              }
            : {}),
        },
        select: {
          key: true,
          id: true,
          value: true,
        },
      });

      if (environmentId !== undefined) {
        const prevValueOfFeature =
          savedFeature.environmentOverrides?.[0]?.value ?? savedFeature.value;

        await this.#changeLogService.logUpdateFeature({
          environmentId: environmentId,
          featureId: savedFeature.id,
          changeData: FeatureChangelogUtil.buildChangeData(
            prevValueOfFeature,
            value as Prisma.InputJsonValue,
          ),
          ownerId: request.user.userId,
        });
      }
      reply.status(200).send({
        feature: {
          id: updatedFeature.id,
        },
      });
    } catch (e) {
      this.app.log.error(e);
      reply.status(500).send({
        message: 'Failed to update feature!',
      });
    }
  };

  public getAll: Handler<GetAllFeaturesRouteInterface> = async (
    request,
    reply,
  ) => {
    const {
      environmentId,
      projectId,
      environmentKey,
      projectKey,
      sortBy,
      direction,
      search,
      offset,
      limit,
    } = request.query;

    const sort = sortBy ?? FeatureSortBy.Key;
    const order = direction ?? SortOrder.Asc;

    const resultWithTotal = await this.getFeatures({
      where: {
        project: {
          ...(projectId !== undefined
            ? {
                id: projectId,
              }
            : {}),
          ...(projectKey !== undefined
            ? {
                key: projectKey,
              }
            : {}),
        },
        ownerId: request.user.userId,
        ...(search !== undefined && search?.trim() !== ''
          ? {
              key: {
                startsWith: search,
              },
            }
          : {}),
        deleted: false,
      },
      environmentId,
      environmentKey,
      sort,
      order,
      offset,
      limit,
    });
    reply.send(resultWithTotal);
  };

  public getFeatureChangelog: Handler<GetFeatureChangeLogRouteInterface> =
    async (request, reply) => {
      const changes = await this.#changeLogService.getFeatureChangelog(
        request.params.featureId,
        undefined,
      );

      if (changes.length > 0) {
        reply.send(changes);
      } else {
        reply.status(404).send({
          message: 'Feature change log not found!',
        });
      }
    };

  public deleteFeature: Handler<DeleteFeatureRouteInterface> = async (
    request,
    reply,
  ) => {
    const { featureId } = request.params;

    try {
      await this.app.prisma.$transaction([
        this.app.prisma.feature.update({
          where: {
            id: featureId,
          },
          data: {
            deleted: true,
          },
        }),
        this.app.prisma.featureChangeLog.create({
          data: {
            featureId: featureId,
            ownerId: request.user.userId,
            type: FeatureChangeLogType.DELETE,
          },
        }),
      ]);

      reply.status(204).send();
    } catch (e) {
      this.app.log.error(e);
      reply.status(500).send({
        message: 'Failed to delete feature!',
      });
    }
  };

  public getAllFeaturesForAccessKey: Handler<GetAllFeaturesPublicRouteInterface> =
    async (
      request: FastifyRequestWithAccessKey<GetAllFeaturesPublicRouteInterface>,
      reply,
    ) => {
      const { projectId, orgId, environmentId } = request.accessKey!; // PreHandler ensures that accessKey is present

      const { sortBy, sortOrder } = request.query;

      const sort = sortBy ?? FeatureSortBy.Key;
      const order = sortOrder ?? SortOrder.Asc;

      const featuresWithEnvironmentSpecificInfo = await this.getFeatures({
        where: {
          projectId: projectId,
          orgId: orgId,
        },
        environmentId: environmentId,
        environmentKey: undefined,
        sort: sort,
        order: order,
      });

      return reply.send(featuresWithEnvironmentSpecificInfo);
    };

  private async getFeatures({
    where,
    environmentId,
    environmentKey,
    sort = FeatureSortBy.Key,
    order = SortOrder.Asc,
    offset = 0,
    limit = 1000,
  }: GetFeaturesArgs) {
    const [features, total] = await this.app.prisma.$transaction([
      this.app.prisma.feature.findMany({
        where: where,
        select: {
          id: true,
          key: true,
          type: true,
          value: true,
          description: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          environmentOverrides: {
            where: {
              environment: {
                ...(environmentId !== undefined
                  ? {
                      id: environmentId,
                    }
                  : {}),
                ...(environmentKey !== undefined
                  ? {
                      key: environmentKey,
                    }
                  : {}),
              },
            },
            select: {
              environment: {
                select: {
                  id: true,
                  name: true,
                  key: true,
                },
              },
              value: true,
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
          updatedAt: true,
          createdAt: true,
        },
        orderBy: {
          [sort]: order,
        },
        skip: offset,
        take: limit,
      }),
      this.app.prisma.feature.count({
        where: where,
      }),
    ]);

    const hasEnvironmentFilterApplied =
      environmentId !== undefined || environmentKey !== undefined;

    return {
      total,
      data: features.map((feature) => {
        const hasEnvOverride = feature.environmentOverrides.length > 0;
        return {
          id: feature.id,
          key: feature.key,
          type: feature.type,
          project: feature.project,
          description: feature.description,
          createdAt: feature.createdAt,
          updatedAt: feature.updatedAt,
          createdBy: feature.owner,
          value:
            hasEnvironmentFilterApplied && hasEnvOverride
              ? feature.environmentOverrides[0].value
              : feature.value,
        };
      }),
    };
  }
}

type GetFeaturesArgs = {
  where: Prisma.FeatureWhereInput;
  environmentId?: string;
  environmentKey?: string;
  sort?: FeatureSortBy;
  order?: SortOrder;
  offset?: number;
  limit?: number;
};
