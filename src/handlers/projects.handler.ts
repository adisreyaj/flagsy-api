import { Prisma } from '@prisma/client';
import { Handler } from '../schema/handler.type';

const create: Handler = (app) => {
  return async (request, reply) => {
    const { name, ownerId, key } =
      request.body as Prisma.ProjectUncheckedCreateInput;
    const project = await app.prisma.project.create({
      data: {
        name,
        key,
        ownerId,
      },
      select: {
        id: true,
      },
    });
    reply.send(project);
  };
};

const getAll: Handler = (app) => {
  return async (_request, reply) => {
    const projects = await app.prisma.project.findMany({
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
      },
    });
    reply.send(projects);
  };
};

export { create, getAll };
