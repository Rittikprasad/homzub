import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';

export interface IServiceState {
  serviceCities: IUnit[];
  serviceAssets: IAsset[];
  loaders: {
    serviceCities: boolean;
    serviceAssets: boolean;
  };
}
