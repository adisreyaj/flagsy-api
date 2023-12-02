import { FastifySchema } from 'fastify/types/schema';
import z from 'zod';

export abstract class UserSchema {
  public static userMetaSchema = z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  });

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
}
