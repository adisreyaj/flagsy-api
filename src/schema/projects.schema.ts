import z from 'zod';

export abstract class ProjectSchema {
  public static projectMetaSchema = z.object({
    id: z.string(),
    name: z.string(),
  });
}
