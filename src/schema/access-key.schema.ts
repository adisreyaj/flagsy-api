import { FastifySchema } from 'fastify/types/schema';
import z from 'zod';

export abstract class AccessKeySchema {
  public static createAccessKey: FastifySchema = {
    body: z.object({
      type: z.enum(['READ', 'WRITE']),
      projectId: z.string(),
      organizationId: z.string(),
    }),
    response: {
      200: z.object({
        id: z.string(),
        key: z.string(),
        type: z.enum(['READ', 'WRITE']),
      }),
    },
  } as const;
}
