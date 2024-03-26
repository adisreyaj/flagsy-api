import { FastifyInstance } from 'fastify';
import {
  CreateEnvironmentRouteInterface,
  GetAllEnvironmentRouteInterface,
} from '../types/environments.type';
import { Handler } from '../types/handler.type';

export class EnvironmentsHandler {
  public constructor(private app: FastifyInstance) {
    this.app = app;
  }

  public create: Handler<CreateEnvironmentRouteInterface> = async (
    request,
    reply,
  ) => {
    const { name, projectId, key } = request.body;
    const environment = await this.app.prisma.environment.create({
      data: {
        name,
        key,
        ownerId: request.user.userId,
        projectId,
        orgId: request.user.orgId,
      },
      select: {
        id: true,
      },
    });
    reply.send(environment);
  };

  public getAll: Handler<GetAllEnvironmentRouteInterface> = async (
    request,
    reply,
  ) => {
    const { projectId } = request.query;

    const environments = await this.app.prisma.environment.findMany({
      where: {
        org: {
          id: request.user.orgId,
        },
        projectId,
      },
      select: {
        id: true,
        name: true,
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    reply.send(environments);
  };
}
