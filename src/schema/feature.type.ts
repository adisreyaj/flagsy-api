import { FeatureValueType } from '@prisma/client';

export interface FeatureCreateData {
  key: string;
  projectId: string;
  valueType: FeatureValueType;
  value: any;
  environmentOverrides: {
    environmentId: string;
    value: any;
  }[];
}
