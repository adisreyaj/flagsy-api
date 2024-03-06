import { Prisma } from '@prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Handler } from '../types/handler.type';
import { CreateUserRouteInterface } from '../types/user.type';

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

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

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

    const jwt = await AuthUtil.generateJWT(reply, user.id, user.orgs?.[0].id);
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
      throw new Error('Invalid email or password');
    }

    const jwt = await AuthUtil.generateJWT(reply, user.id, user.orgs?.[0].id);

    AuthUtil.setCookie(reply, jwt);
    reply.send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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
      },
    });

    if (!user) {
      reply.send();
      return;
    }

    reply.send(user);
  };
}
