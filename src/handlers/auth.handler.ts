import { Prisma } from '@prisma/client';
import { compare } from 'bcryptjs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Handler } from '../types/handler.type';
import {
  CreateUserRouteInterface,
  UpdatePasswordRouteInterface,
} from '../types/user.type';

import { AuthUtil } from '../util/auth.util';

export class AuthHandler {
  public constructor(private app: FastifyInstance) {
    this.app = app;
  }

  public register: Handler<CreateUserRouteInterface> = async (
    request,
    reply,
  ) => {
    const { email, password, firstName, lastName, orgName } = request.body;

    const hashedPassword = await AuthUtil.hashPassword(password);

    const user = await this.app.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        orgs: {
          create: {
            name: orgName,
            key: orgName.toLowerCase().replaceAll(' ', '-'),
          },
        },
      },
      select: {
        id: true,
        orgs: {
          take: 1,
          select: {
            id: true,
          },
        },
      },
    });

    const jwt = await AuthUtil.generateJWT({
      reply: reply,
      userId: user.id,
      orgId: user.orgs![0].id,
    });
    AuthUtil.setCookie(reply, jwt);
    reply.send(user);
  };

  public login: Handler = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const { email, password } = request.body as Prisma.UserCreateInput;

    const user = await this.app.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        password: true,
        email: true,
        role: true,
        orgs: {
          take: 1,
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      reply.send();
      return;
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      this.app.log.debug('Invalid credentials');
      return reply.status(401).send({
        message: 'Invalid credentials',
      });
    }

    const scopes = AuthUtil.getScopesForRoles([user.role]);
    const jwt = await AuthUtil.generateJWT({
      reply: reply,
      userId: user.id,
      orgId: user.orgs![0].id,
      roles: [user.role],
      scopes: scopes,
    });

    AuthUtil.setCookie(reply, jwt);
    reply.send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      scopes: scopes,
    });
  };

  public logout: Handler = async (
    _request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    reply.clearCookie('token').send({
      message: 'Logged out successfully',
    });
  };

  public me: Handler = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await this.app.prisma.user.findUnique({
      where: {
        id: request.user.userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      reply.status(404).send({
        message: 'User not found',
      });
      return;
    }

    reply.send({
      ...user,
      role: user.role,
      scopes: AuthUtil.getScopesForRoles([user.role]),
    });
  };

  public updatePassword: Handler<UpdatePasswordRouteInterface> = async (
    request,
    reply,
  ) => {
    const { userId } = request.user;
    const { newPassword, oldPassword } = request.body;
    const userSaved = await this.app.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!userSaved) {
      return reply.status(400).send({
        message: 'Bad request',
      });
    }

    const isPasswordValid = await compare(oldPassword, userSaved.password);

    if (!isPasswordValid) {
      return reply.status(401).send({
        message: 'Invalid credentials',
      });
    }

    const hashedPassword = await AuthUtil.hashPassword(newPassword);

    const user = await this.app.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    reply.send({
      id: user.id,
    });
  };
}
