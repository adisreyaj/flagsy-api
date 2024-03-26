import { FastifyInstance } from 'fastify';
import { Permission, Scope } from '../config/rbac.config';
import { FeaturesHandler } from '../handlers/features.handler';
import { validateRbac } from '../plugins/rbac.plugin';
import { FeaturesSchema } from '../schema/features.schema';
import { AuthUtil } from '../util/auth.util';

export const FEATURE_ROUTES = async (app: FastifyInstance) => {
  const handler = new FeaturesHandler(app);

  app.route({
    method: 'GET',
    url: '/',
    schema: FeaturesSchema.getAllFeatures,
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['USER', 'ADMIN'],
        [
          {
            scope: Scope.Feature,
            permissions: [Permission.Read],
          },
        ],
      ),
    ],
    handler: handler.getAll,
  });

  app.route({
    method: 'GET',
    url: '/:featureId/changelog',
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['USER', 'ADMIN'],
        [
          {
            scope: Scope.ChangeLog,
            permissions: [Permission.Read],
          },
        ],
      ),
    ],
    handler: handler.getFeatureChangelog,
  });

  app.route({
    method: 'POST',
    url: '/',
    preHandler: [
      app.auth([app.validateToken]),
      validateRbac(
        ['ADMIN'],
        [
          {
            scope: Scope.Feature,
            permissions: [Permission.Write],
          },
        ],
      ),
    ],
    handler: handler.create,
  });

  app.route({
    method: 'POST',
    url: '/:featureId',
    preHandler: [
      app.auth([app.validateToken]),
      AuthUtil.userHasAccessToFeature(app),
      validateRbac(
        ['ADMIN'],
        [
          {
            scope: Scope.Feature,
            permissions: [Permission.Write],
          },
        ],
      ),
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
