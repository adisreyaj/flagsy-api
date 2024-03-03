import { FastifyInstance } from 'fastify';
import { FeaturesHandler } from '../handlers/features.handler';
import { FeaturesSchema } from '../schema/features.schema';
import { AuthUtil } from '../util/auth.util';

export const FEATURE_ROUTES = async (app: FastifyInstance) => {
  const handler = new FeaturesHandler(app);

  app.route({
    method: 'GET',
    url: '/',
    schema: FeaturesSchema.getAllFeatures,
    preHandler: app.auth([app.validateToken]),
    handler: handler.getAll,
  });

  app.route({
    method: 'GET',
    url: '/:featureId/changelog',
    preHandler: app.auth([app.validateToken]),
    handler: handler.getFeatureChangelog,
  });

  app.route({
    method: 'POST',
    url: '/',
    preHandler: [app.auth([app.validateToken])],
    handler: handler.create,
  });

  app.route({
    method: 'POST',
    url: '/:featureId',
    preHandler: [
      app.auth([app.validateToken]),
      AuthUtil.userHasAccessToFeature(app),
    ],
    handler: handler.update,
  });

  app.route({
    method: 'DELETE',
    url: '/:featureId',
    preHandler: [
      app.auth([app.validateToken]),
      AuthUtil.userHasAccessToFeature(app),
    ],
    handler: handler.deleteFeature,
  });
};
