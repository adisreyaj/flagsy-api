import {
  CreateEnvironmentRouteInterface,
  GetAllEnvironmentRouteInterface,
} from '../types/environments.type';
import { Handler } from '../types/handler.type';

const create: Handler<CreateEnvironmentRouteInterface> = (app) => {
  return async (request, reply) => {
    const { name, projectId, key } = request.body;
    const environment = await app.prisma.environment.create({
      data: {
        name,
        key,
        ownerId: request.user.userId,
        projectId,
        orgId: request.user.orgId,
      },
      select: {
        id: true,
      },
    });
    reply.send(environment);
  };
};

const getAll: Handler<GetAllEnvironmentRouteInterface> = (app) => {
  return async (request, reply) => {
    const { projectId } = request.query;

    const environments = await app.prisma.environment.findMany({
      where: {
        ownerId: request.user.userId,
        projectId,
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
