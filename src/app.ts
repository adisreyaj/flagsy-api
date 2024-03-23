import auth, { FastifyAuthFunction } from '@fastify/auth';
import cookie, { type FastifyCookieOptions } from '@fastify/cookie';
import cors, { type FastifyCorsOptions } from '@fastify/cors';
import { fastifyEnv } from '@fastify/env';
import { fastifyJwt } from '@fastify/jwt';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import dotenv from 'dotenv';
import Fastify, { FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import pino from 'pino';
import type { LokiOptions } from 'pino-loki';
import { PrettyOptions } from 'pino-pretty';
import queryString from 'query-string-esm';
import { ZodError } from 'zod';

import { ENV_SCHEMA } from './config/app.config';
import { validateTokenPlugin } from './plugins/authentication.plugin';
import prisma from './plugins/prisma.plugin';
import { ACCESS_KEY_ROUTES } from './routes/access-key.route';
import { AUTH_ROUTES } from './routes/auth.routes';
import { CHANGELOG_ROUTES } from './routes/changelog.routes';
import { ENVIRONMENT_ROUTES } from './routes/environments.routes';
import { FEATURE_ROUTES } from './routes/feature.routes';
import { ORG_ROUTES } from './routes/org.routes';
import { PROJECT_ROUTES } from './routes/projects.routes';
import { PUBLIC_ROUTES } from './routes/public.routes';
import { USER_ROUTES } from './routes/users.routes';

export class App {
  public app: FastifyInstance;

  constructor() {
    dotenv.config();
    this.app = Fastify({
      disableRequestLogging: true,
      logger: {
        stream: pino.multistream(this.getLoggerStreams()),
        level: 'info',
      },
      querystringParser: (str) => {
        return queryString.parse(str, {
          parseNumbers: true,
        });
      },
    }).withTypeProvider<JsonSchemaToTsProvider>();
  }

  async start(): Promise<FastifyInstance> {
    await this.init();
    await this.app.listen({ port: this.app.config.PORT });
    return this.app;
  }

  private async init() {
    await this.setupEnvConfig();
    this.app.setErrorHandler((error) => {
      this.app.log.error(error);
    });
    this.setupZodSchemaValidator();
    this.setupCors();
    this.setupAuth();
    this.setupCookies();
    this.setupPrisma();
    this.registerRoutes();
  }

  private setupZodSchemaValidator(): void {
    this.app.withTypeProvider<ZodTypeProvider>();
    this.app.setValidatorCompiler(validatorCompiler);
    this.app.setSerializerCompiler(serializerCompiler);
    this.app.setErrorHandler((error, _request, reply) => {
      if (error instanceof ZodError) {
        const isDev = this.app.config.NODE_ENV === 'development';
        return reply.status(400).send({
          message: 'Invalid request',
          ...(isDev ? { errors: error.issues } : {}),
        });
      }
    });
  }

  private registerRoutes() {
    this.app.register(AUTH_ROUTES, { prefix: '/auth' });
    this.app.register(USER_ROUTES, { prefix: '/users' });
    this.app.register(ORG_ROUTES, { prefix: '/orgs' });
    this.app.register(ENVIRONMENT_ROUTES, { prefix: '/environments' });
    this.app.register(PROJECT_ROUTES, { prefix: '/projects' });
    this.app.register(FEATURE_ROUTES, { prefix: '/features' });
    this.app.register(ACCESS_KEY_ROUTES, { prefix: '/access-key' });
    this.app.register(CHANGELOG_ROUTES, { prefix: '/changelog' });

    this.app.register(PUBLIC_ROUTES, { prefix: '/public' });
  }

  private async setupEnvConfig() {
    await this.app.register(fastifyEnv, {
      schema: ENV_SCHEMA,
      dotenv: true,
    });
  }

  private setupCors() {
    this.app.register(cors, {
      credentials: true,
      origin: ['http://localhost:4200', 'https://flagsy.adi.so'],
    } as FastifyCorsOptions);
  }

  private setupAuth() {
    this.app.register(fastifyJwt, {
      secret: this.app.config.JWT_SECRET,
      cookie: {
        cookieName: 'token',
        signed: true,
      },
      sign: {
        algorithm: 'HS256',
        iss: 'flagsy.adi.so',
      },
      verify: { allowedIss: 'flagsy.adi.so' },
    });

    this.app.register(auth);
    this.app.register(validateTokenPlugin);
  }

  private setupCookies() {
    this.app.register(cookie, {
      hook: 'preHandler',
      secret: this.app.config.COOKIE_SECRET,
      algorithm: 'sha256',
      parseOptions: {
        path: '/',
        signed: true,
        sameSite: 'strict',
        secure: this.app.config.NODE_ENV === 'production',
        httpOnly: this.app.config.NODE_ENV === 'production',
      },
    } as FastifyCookieOptions);
  }

  private setupPrisma() {
    this.app.register(prisma);
  }

  private getLoggerStreams() {
    const pinoTransport = pino.transport<PrettyOptions>({
      target: 'pino-pretty',
      options: {
        colorize: true,
        colorizeObjects: true,
        translateTime: 'SYS:hh:MM:ss TT',
        ignore: 'pid,hostname',
      },
    });
    const lokiTransport = pino.transport<LokiOptions>({
      target: 'pino-loki',
      options: {
        batching: false,
        host: process.env.LOKI_URL!,
        basicAuth: {
          username: process.env.LOKI_USERNAME!,
          password: process.env.LOKI_TOKEN!,
        },
      },
    });

    return [
      { level: 'debug', stream: lokiTransport },
      { level: 'debug', stream: pinoTransport },
    ];
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      JWT_SECRET: string;
      COOKIE_SECRET: string;
      NODE_ENV: string;
      LOKI_URL: string;
      LOKI_USERNAME: string;
      LOKI_TOKEN: string;
    };
    validateToken: FastifyAuthFunction;
  }
}
