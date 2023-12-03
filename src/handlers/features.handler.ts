import { Prisma } from '@prisma/client';
import { SortOrder } from '../types/common.type';
import {
  CreateFeatureRouteInterface,
  DeleteFeatureRouteInterface,
  FeatureSortBy,
  GetAllFeaturesRouteInterface,
} from '../types/feature.type';
import { Handler } from '../types/handler.type';

const create: Handler<CreateFeatureRouteInterface> = (app) => {
  return async (request, reply) => {
    const {
      projectId,
      key,
      value,
      description,
      valueType: type,
    } = request.body;

    app.log.info({
      projectId,
      key,
      value,
      type,
    });

    try {
      const feature = await app.prisma.feature.create({
        data: {
          projectId,
          key,
          type,
          value,
          ownerId: request.user.userId,
          orgId: request.user.orgId,
          description,
        },
        select: {
          id: true,
        },
      });

      reply.status(201).send({
        feature: {
          id: feature.id,
        },
      });
    } catch (e) {
      reply.status(500).send({
        message: 'Failed to create feature!',
      });
    }
  };
};

const update: Handler<CreateFeatureRouteInterface> = (app) => {
  return async (request, reply) => {
    const { valueType: type, description, environmentOverrides } = request.body;
    const { featureId } = request.params as { featureId: string };

    // Only one per request for now
    const environmentOverride = environmentOverrides?.[0];

    try {
      await app.prisma.feature.findUniqueOrThrow({
        where: {
          id: featureId,
        },
        select: {
          type: true,
          value: true,
        },
      });

      const feature = await app.prisma.feature.update({
        where: {
          id: featureId,
          ownerId: request.user.userId,
        },
        data: {
          ...(description !== undefined ? { description } : {}),
          ...(type !== undefined ? { type } : {}),
          ...(environmentOverride !== undefined
            ? {
                environmentOverrides: {
                  upsert: {
                    where: {
                      environmentId_featureId: {
                        environmentId: environmentOverride.environmentId,
                        featureId: featureId,
                      },
                    },
                    update: {
                      environment: {
                        connect: {
                          id: environmentOverride.environmentId,
                        },
                      },
                      value: environmentOverride.value as Prisma.InputJsonValue,
                    },
                    create: {
                      environment: {
                        connect: {
                          id: environmentOverride.environmentId,
                        },
                      },
                      value: environmentOverride.value as Prisma.InputJsonValue,
                    },
                  },
                },
              }
            : {}),
        },
        select: {
          id: true,
        },
      });

      reply.status(201).send({
        feature: {
          id: feature.id,
        },
      });
    } catch (e) {
      reply.status(500).send({
        message: 'Failed to update feature!',
      });
    }
  };
};

const getAll: Handler<GetAllFeaturesRouteInterface> = (app) => {
  return async (request, reply) => {
    const { environmentId, projectId, sortBy, sortOrder, search } =
      request.query;

    const sort = sortBy ?? FeatureSortBy.Key;
    const order = sortOrder ?? SortOrder.Asc;

    const features = await app.prisma.feature.findMany({
      where: {
        projectId,
        ownerId: request.user.userId,
        ...(search !== undefined && search?.trim() !== ''
          ? {
              key: {
                startsWith: search,
              },
            }
          : {}),
      },
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
            environmentId,
          },
          select: {
            environment: {
              select: {
                id: true,
                name: true,
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
      },
      orderBy: {
        [sort]: order,
      },
    });

    const featuresWithEnvironmentSpecificInfo = features.map((feature) => {
      const hasEnvOverride = feature.environmentOverrides.length > 0;
      return {
        id: feature.id,
        key: feature.key,
        type: feature.type,
        project: feature.project,
        description: feature.description,
        value:
          environmentId && hasEnvOverride
            ? feature.environmentOverrides[0].value
            : feature.value,
      };
    });

    reply.send(featuresWithEnvironmentSpecificInfo);
  };
};

const deleteFeature: Handler<DeleteFeatureRouteInterface> = (app) => {
  return async (request, reply) => {
    const { featureId } = request.params;

    try {
      await app.prisma.feature.delete({
        where: {
          id: featureId,
          ownerId: request.user.userId,
          orgId: request.user.orgId,
        },
      });

      reply.status(204).send();
    } catch (e) {
      app.log.error(e);
      reply.status(500).send({
        message: 'Failed to delete feature!',
      });
    }
  };
};

export { create, getAll, update, deleteFeature };
