import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  create,
  deleteFeature,
  getAll,
  update,
} from '../handlers/features.handler';

export const FEATURE_ROUTES = async (app: FastifyInstance) => {
  const userHasAccessToFeature = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const { featureId } = request.params as { featureId: string };

    const feature = await app.prisma.feature.findUnique({
      where: {
        id: featureId,
        ownerId: request.user.userId,
        orgId: request.user.orgId,
      },
      select: {
        id: true,
        orgId: true,
        ownerId: true,
      },
    });

    if (!feature) {
      return reply.status(404).send(new Error('Feature not found'));
    }
    if (
      feature?.orgId !== request.user.orgId ||
      feature?.ownerId !== request.user.userId
    ) {
      return reply.status(401).send(new Error('Unauthorized'));
    }
  };

  app.route({
    method: 'GET',
    url: '/',
    preHandler: app.auth([app.validateToken]),
    handler: getAll(app),
  });

  app.route({
    method: 'POST',
    url: '/',
    preHandler: app.auth([app.validateToken]),

    handler: create(app),
  });

  app.route({
    method: 'POST',
    url: '/:featureId',
    preHandler: [app.auth([app.validateToken]), userHasAccessToFeature],
    handler: update(app),
  });

  app.route({
    method: 'DELETE',
    url: '/:featureId',
    preHandler: [app.auth([app.validateToken]), userHasAccessToFeature],
    handler: deleteFeature(app),
  });
};
