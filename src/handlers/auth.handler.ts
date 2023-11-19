import { Prisma } from '@prisma/client';
import { compare, genSalt, hash } from 'bcryptjs';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { Handler } from '../schema/handler.type';

const setCookie = (reply: FastifyReply, jwt: string) => {
  return reply.setCookie('token', jwt);
};

const generateJWT = async (
  reply: FastifyReply,
  userId: string,
): Promise<string> => {
  return await reply.jwtSign({
    userId: userId,
  });
};

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
    const jwt = await generateJWT(reply, user.id);
    setCookie(reply, jwt).send(user);
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
        password: true,
        id: true,
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

    const jwt = await generateJWT(reply, user.id);

    setCookie(reply, jwt).send({
      message: 'Logged in successfully',
    });
  };
};

export { register, login };
