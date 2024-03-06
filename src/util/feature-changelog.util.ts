import { Prisma } from '@prisma/client';

export abstract class FeatureChangelogUtil {
  static buildChangeData = (
    oldValue: FeatureChangeDataValueType,
    newValue: FeatureChangeDataValueType,
  ): Prisma.InputJsonValue => {
    return {
      old: {
        value: oldValue,
      },
      new: {
        value: newValue,
      },
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
