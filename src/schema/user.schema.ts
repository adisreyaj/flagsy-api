import z from 'zod';

export abstract class UserSchema {
  public static userMetaSchema = z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  });
}
