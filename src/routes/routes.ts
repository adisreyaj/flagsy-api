import { FastifyInstance } from 'fastify';
import { AUTH_ROUTES } from './auth.routes';
import { ENVIRONMENT_ROUTES } from './environments.routes';
import { FEATURE_ROUTES } from './feature.routes';
import { PROJECT_ROUTES } from './projects.routes';
import { USER_ROUTES } from './users.routes';

export const registerRoutes = (app: FastifyInstance) => {
  app.register(AUTH_ROUTES, { prefix: '/auth' });
  app.register(USER_ROUTES, { prefix: '/users' });
  app.register(ENVIRONMENT_ROUTES, { prefix: '/environments' });
  app.register(PROJECT_ROUTES, { prefix: '/projects' });
  app.register(FEATURE_ROUTES, { prefix: '/features' });
  return app;
};
