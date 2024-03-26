import { FastifySchema } from 'fastify/types/schema';
import z from 'zod';
import { CommonSchema } from './common.schema';

export abstract class UserSchema {
  public static userMetaSchema = z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  });

  public static getAllUsers: FastifySchema = {
    response: {
      200: z.array(UserSchema.userMetaSchema),
    },
  } as const;

  public static createUser: FastifySchema = {
    body: z.object({
      email: z.string().email(),
      password: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      orgName: z.string(),
    }),
    response: {
      200: z.object({
        id: z.string(),
      }),
    },
  } as const;

  public static addUserToOrg: FastifySchema = {
    body: z.object({
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      role: z.enum(['ADMIN', 'USER']),
      orgId: z.string(),
    }),
    response: {
      200: UserSchema.userMetaSchema,
    },
  } as const;

  public static login: FastifySchema = {
    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    response: {
      200: UserSchema.userMetaSchema,
    },
  } as const;

  public static me: FastifySchema = {
    response: {
      200: UserSchema.userMetaSchema.extend({
        role: z.enum(['ADMIN', 'USER']),
        scopes: z.array(z.string()),
      }),
    },
  } as const;

  public static updatePassword: FastifySchema = {
    body: z.object({
      oldPassword: z.string(),
      newPassword: z.string(),
    }),
    response: {
      ...CommonSchema.errors,
      200: z.object({
        id: z.string(),
      }),
    },
  } as const;
}
