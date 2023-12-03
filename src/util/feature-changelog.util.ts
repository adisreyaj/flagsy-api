import { Prisma } from '@prisma/client';

export abstract class FeatureChangelogUtil {
  static buildChangeData = (
    data: CreateChangeLogData,
  ): Prisma.InputJsonValue => {
    return {
      type: FeatureChangeType.ValueChange,
      old: {
        value: data.featureOld.value,
        type: data.featureOld.type,
      },
      new: {
        value: data.featureNew.value,
        type: data.featureNew.type,
      },
    };
  };
}

export enum FeatureChangeType {
  ValueChange = 'VALUE_CHANGE',
}

export interface FeatureChangeData {
  type: string;
  value: string | number | boolean | Prisma.InputJsonValue | null;
}

export interface CreateChangeLogData {
  featureOld: FeatureChangeData;
  featureNew: FeatureChangeData;
}
