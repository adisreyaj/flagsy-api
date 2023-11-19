import { Prisma } from '@prisma/client';
import { Handler } from '../schema/handler.type';

const create: Handler = (app) => {
  return async (request, reply) => {
    const { name, projectId, key } =
      request.body as Prisma.EnvironmentUncheckedCreateInput;
    const environment = await app.prisma.environment.create({
      data: {
        name,
        key,
        ownerId: request.user.userId,
        projectId,
      },
      select: {
        id: true,
      },
    });
    reply.send(environment);
  };
};

const getAll: Handler = (app) => {
  return async (request, reply) => {
    const environments = await app.prisma.environment.findMany({
      where: {
        ownerId: request.user.userId,
      },
      select: {
        id: true,
        name: true,
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    reply.send(environments);
  };
};

export { getAll, create };
