import { FeatureCreateData } from '../schema/feature.type';
import { Handler } from '../schema/handler.type';

const create: Handler = (app) => {
  return async (request, reply) => {
    const {
      projectId,
      key,
      value,
      valueType: type,
    } = request.body as FeatureCreateData;

    reply.log.debug({ projectId, key, value, type });

    await app.prisma.feature.create({
      data: {
        project: {
          connect: {
            id: projectId,
          },
        },
        key,
        type,
        value,
        owner: {
          connect: {
            id: 'clp4ey6r500009lxcg591c3or',
          },
        },
      },
      select: {
        id: true,
      },
    });

    reply.send('OK');
  };
};

const getAll: Handler = (app) => {
  app.log.debug('Get All Features');

  return async (_request, reply) => {
    const projects = await app.prisma.feature.findMany({
      select: {
        id: true,
        key: true,
        type: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        environmentOverrides: {
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
    reply.send(projects);
  };
};

export { create, getAll };
