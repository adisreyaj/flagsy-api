import { FastifyInstance } from 'fastify';
import { OrgsHandler } from '../handlers/orgs.handler';

export const ORG_ROUTES = async (app: FastifyInstance) => {
  const handler = new OrgsHandler(app);

  app.route({
    method: 'GET',
    url: '/',
    handler: handler.getAll,
  });
};
