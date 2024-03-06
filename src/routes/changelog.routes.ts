import { FastifyInstance } from 'fastify';
import { ChangelogHandler } from '../handlers/changelog.handler';

export const CHANGELOG_ROUTES = async (app: FastifyInstance) => {
  const handler = new ChangelogHandler(app);
  app.route({
    method: 'GET',
    url: '/',
    preHandler: app.auth([app.validateToken]),
    handler: handler.getAll,
  });
};
