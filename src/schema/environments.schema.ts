import { FastifySchema } from 'fastify/types/schema';
import z from 'zod';
import { ProjectSchema } from './projects.schema';
import { UserSchema } from './user.schema';

export abstract class EnvironmentsSchema {
  public static getAllEnvironments: FastifySchema = {
    querystring: z.object({
      projectId: z.string().optional(),
    }),
    response: {
      200: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          owner: UserSchema.userMetaSchema,
          project: ProjectSchema.projectMetaSchema,
        }),
      ),
    },
  } as const;

  public static createEnvironment: FastifySchema = {
    body: z.object({
      name: z.string(),
      key: z.string(),
      projectId: z.string(),
    }),
    response: {
      200: z.object({
        id: z.string(),
      }),
    },
  } as const;
}
