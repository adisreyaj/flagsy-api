import { FastifySchema } from 'fastify/types/schema';
import z from 'zod';

export abstract class FeaturesSchema {
  public static getAllFeatures: FastifySchema = {
    querystring: z.object({
      sortBy: z.string().optional(),
      direction: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      projectId: z.string().optional(),
      environmentId: z.string().optional(),
      projectKey: z.string().optional(),
      environmentKey: z.string().optional(),
    }),
    response: {
      200: z.object({
        total: z.number(),
        data: z.array(
          z.object({
            project: z.object({
              id: z.string(),
              name: z.string(),
            }),
            description: z.string(),
            id: z.string(),
            type: z.string(),
            value: z.union([z.string(), z.number(), z.boolean()]),
            key: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
            createdBy: z.object({
              id: z.string(),
              email: z.string(),
              firstName: z.string(),
              lastName: z.string(),
            }),
          }),
        ),
      }),
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
