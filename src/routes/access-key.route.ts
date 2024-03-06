import { FastifyInstance } from 'fastify';
import { AccessKeyHandler } from '../handlers/access-key.handler';
import { AccessKeySchema } from '../schema/access-key.schema';
import { CreateAccessKeyRouteInterface } from '../types/access-key.type';

export const ACCESS_KEY_ROUTES = async (app: FastifyInstance) => {
  const handler = new AccessKeyHandler(app);

  app.route<CreateAccessKeyRouteInterface>({
    method: 'POST',
    url: '/',
    schema: AccessKeySchema.createAccessKey,
    preHandler: app.auth([app.validateToken]),
    handler: handler.create,
  });
};
