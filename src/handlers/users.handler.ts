import { Handler } from '../schema/handler.type';

const getAll: Handler = (app) => {
  return async (_request, reply) => {
    const users = await app.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    reply.send(users);
  };
};

export { getAll };
