import { FastifyInstance } from 'fastify';
import { ProjectsHandler } from '../handlers/projects.handler';

export const PROJECT_ROUTES = async (app: FastifyInstance) => {
  const handler = new ProjectsHandler(app);
  app.route({
    method: 'GET',
    url: '/',
    preHandler: app.auth([app.validateToken]),
    handler: handler.getAll,
  });

  app.route({
    method: 'POST',
    url: '/',
    preHandler: app.auth([app.validateToken]),
    handler: handler.create,
  });
};
