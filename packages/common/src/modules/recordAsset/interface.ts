import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { IAssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';
import { IValueAddedServices } from '@homzhub/common/src/domain/models/ValueAddedService';

export interface IEditPropertyFlow {
  isEditPropertyFlow: boolean;
  showBottomSheet: boolean;
}

export interface IRecordAssetState {
  assetId: number;
  assetDetails: IAsset | null;
  assetPlan: IAssetPlan[];
  assetGroups: IAssetGroup[];
  maintenanceUnits: IUnit[];
  selectedAssetPlan: ISelectedAssetPlan;
  valueAddedServices: IValueAddedServices[];
  editPropertyFlow: IEditPropertyFlow;
  selectedImages: AssetGallery[];
  error: {
    assetPlan: string;
  };
  loaders: {
    assetPlan: boolean;
    assetGroups: boolean;
    assetDetails: boolean;
  };
}
