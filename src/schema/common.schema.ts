import z from 'zod';

export abstract class CommonSchema {
  public static errors = {
    400: z.object({
      message: z.string(),
    }),
    401: z.object({
      message: z.string(),
    }),
    500: z.object({
      message: z.string(),
    }),
  };

  public static pagination = {
    limit: z.number().optional(),
    offset: z.number().optional(),
  } as const;

  public static sort = {
    sortBy: z.string().optional(),
    direction: z.string().optional(),
  } as const;

  public static search = {
    search: z.string().optional(),
  } as const;
}
