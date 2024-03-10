import { Prisma } from '@prisma/client';

export abstract class FeatureChangelogUtil {
  static buildChangeData = (
    oldValue?: FeatureChangeDataValueType,
    newValue?: FeatureChangeDataValueType,
  ): Prisma.InputJsonValue => {
    return {
      old:
        oldValue !== undefined
          ? {
              value: oldValue,
            }
          : undefined,
      new:
        newValue !== undefined
          ? {
              value: newValue,
            }
          : undefined,
    };
  };
}

export enum FeatureChangeType {
  ValueChange = 'VALUE_CHANGE',
  Create = 'CREATE',
  Delete = 'DELETE',
}

export type FeatureChangeDataValueType =
  | string
  | number
  | boolean
  | Prisma.InputJsonValue
  | null;
