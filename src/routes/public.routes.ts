import { FastifyInstance } from 'fastify';
import { FeaturesHandler } from '../handlers/features.handler';
import { FastifyRequestWithAccessKey } from '../types/public-api.type';

export const PUBLIC_ROUTES = async (app: FastifyInstance) => {
  const featuresHandler = new FeaturesHandler(app);

  app.route({
    method: 'GET',
    url: '/features',
    preHandler: [
      async (request: FastifyRequestWithAccessKey, reply) => {
        const accessKey = request.headers['x-access-key'] as string;
        if (!accessKey) {
          reply.status(401).send({
            message: 'Access key is required!',
          });
          return;
        }
        const accessKeyData = await app.prisma.accessKey.findFirst({
          where: {
            key: accessKey,
          },
          select: {
            id: true,
            type: true,
            projectId: true,
            orgId: true,
            key: true,
            environmentId: true,
          },
        });
        if (!accessKeyData) {
          reply.status(401).send({
            message: 'Invalid access key!',
          });
          return;
        }

        request.accessKey = {
          id: accessKeyData.id,
          key: accessKeyData.key,
          orgId: accessKeyData.orgId,
          type: accessKeyData.type,
          projectId: accessKeyData.projectId,
          environmentId: accessKeyData.environmentId,
        };
      },
    ],
    handler: featuresHandler.getAllFeaturesForAccessKey,
  });
};
