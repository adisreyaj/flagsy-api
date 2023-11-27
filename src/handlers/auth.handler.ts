import { Prisma } from '@prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Handler } from '../types/handler.type';

import { AuthUtil } from '../util/auth.util';

const register: Handler = (app: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password, firstName, lastName } =
      request.body as Prisma.UserCreateInput;

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await app.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
      },
    });
    const jwt = await AuthUtil.generateJWT(reply, user.id);
    AuthUtil.setCookie(reply, jwt);
    reply.send(user);
  };
};

const me: Handler = (app: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await app.prisma.user.findUnique({
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
};

const login: Handler = (app: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as Prisma.UserCreateInput;

    const user = await app.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        password: true,
        email: true,
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

    const jwt = await AuthUtil.generateJWT(reply, user.id);

    AuthUtil.setCookie(reply, jwt);
    reply.send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  };
};

const logout: Handler = () => {
  return async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie('token').send({
      message: 'Logged out successfully',
    });
  };
};

export { register, login, logout, me };
