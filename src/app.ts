import auth, { FastifyAuthFunction } from '@fastify/auth';
import cookie, { type FastifyCookieOptions } from '@fastify/cookie';
import cors, { type FastifyCorsOptions } from '@fastify/cors';
import { fastifyEnv } from '@fastify/env';
import { fastifyJwt } from '@fastify/jwt';
import Fastify, { FastifyInstance } from 'fastify';

import authenticateUsingCookiePlugin from './plugins/authentication.plugin';
import prisma from './plugins/prisma.plugin';

export const initApp = async () => {
  await setupEnvConfig();
  setupCors();
  setupAuth();
  setupCookies();
  setupPrisma();
  return app;
};

export const startApp = async (app: FastifyInstance) => {
  await app.listen({ port: app.config.PORT });
  return app;
};

const app: FastifyInstance = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        ignore: 'pid,hostname,req,res,reqId',
        colorize: true,
      },
    },
  },
});

const setupEnvConfig = async (): Promise<void> => {
  await app.register(fastifyEnv, {
    schema: ENV_SCHEMA,
    dotenv: true,
  });
};

const setupCors = (): void => {
  app.register(cors, {
    credentials: true,
    origin: ['http://localhost:4200', 'adi.so'],
  } as FastifyCorsOptions);
};

const setupAuth = (): void => {
  app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
    cookie: {
      cookieName: 'token',
      signed: true,
    },
    formatUser: (user) => {
      return {
        userId: user.userId,
      };
    },
    sign: {
      algorithm: 'HS256',
      iss: 'flagsy.adi.so',
    },
    verify: { allowedIss: 'flagsy.adi.so' },
  });

  app.register(auth);
  app.register(authenticateUsingCookiePlugin);
};

const setupCookies = (): void => {
  app.register(cookie, {
    hook: 'preHandler',
    secret: app.config.COOKIE_SECRET,
    algorithm: 'sha256',
    parseOptions: {
      path: '/',
      signed: true,
      sameSite: 'strict',
      secure: app.config.NODE_ENV === 'production',
      httpOnly: app.config.NODE_ENV === 'production',
    },
  } as FastifyCookieOptions);
};

const setupPrisma = (): void => {
  app.register(prisma);
};

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      JWT_SECRET: string;
      COOKIE_SECRET: string;
      NODE_ENV: string;
    };
    validateToken: FastifyAuthFunction;
  }
}
