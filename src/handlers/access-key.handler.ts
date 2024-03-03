import { FastifyInstance } from 'fastify';
import { randomBytes } from 'node:crypto';
import { CreateAccessKeyRouteInterface } from '../types/access-key.type';
import { Handler } from '../types/handler.type';

export class AccessKeyHandler {
  constructor(private readonly app: FastifyInstance) {
    this.app = app;
  }

  public create: Handler<CreateAccessKeyRouteInterface> = async (
    request,
    reply,
  ) => {
    const data = request.body;

    const accessKey = await this.app.prisma.accessKey.create({
      data: {
        key: randomBytes(32).toString('hex'),
        createdById: request.user.userId,
        projectId: data.projectId,
        orgId: request.user.orgId,
        environmentId: data.environmentId,
        type: data.type,
      },
      select: {
        id: true,
        key: true,
        type: true,
      },
    });

    reply.status(201).send(accessKey);
  };
}
