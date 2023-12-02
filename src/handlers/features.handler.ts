import {
  CreateFeatureRouteInterface,
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
    const { value, valueType: type, description } = request.body;
    const { featureId } = request.params as { featureId: string };

    try {
      const feature = await app.prisma.feature.update({
        where: {
          id: featureId,
        },
        data: {
          description,
          type,
          value,
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
    const { environmentId, projectId } = request.query;
    const features = await app.prisma.feature.findMany({
      where: {
        projectId,
        ownerId: request.user.userId,
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
            ? feature.environmentOverrides?.[0].value
            : feature.value,
      };
    });

    reply.send(featuresWithEnvironmentSpecificInfo);
  };
};

export { create, getAll, update };
