import { FastifySchema } from 'fastify/types/schema';
import z from 'zod';
import { CommonSchema } from './common.schema';

export abstract class FeaturesSchema {
  public static getAllFeatures: FastifySchema = {
    querystring: z.object({
      ...CommonSchema.pagination,
      ...CommonSchema.sort,
      ...CommonSchema.search,
      projectId: z.string().optional(),
      environmentId: z.string().optional(),
      projectKey: z.string().optional(),
      environmentKey: z.string().optional(),
    }),
    response: {
      200: CommonSchema.resultWithTotal({
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
    },
  } as const;
}
