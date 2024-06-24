import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { AssetGroup, SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { AssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IEditPropertyFlow, IRecordAssetState } from '@homzhub/common/src/modules/recordAsset/interface';

const getLoadingState = (state: IState): boolean => {
  const {
    recordAsset: {
      loaders: { assetPlan },
    },
  } = state;
  return assetPlan;
};

const getAssetPlans = (state: IState): AssetPlan[] => {
  const {
    recordAsset: { assetPlan },
  } = state;
  return ObjectMapper.deserializeArray(AssetPlan, assetPlan);
};

const getAssetGroups = (state: IState): AssetGroup[] => {
  const {
    recordAsset: { assetGroups },
  } = state;
  return ObjectMapper.deserializeArray(AssetGroup, assetGroups);
};

const getCurrentAssetId = (state: IState): number => {
  const {
    recordAsset: { assetId },
  } = state;
  return assetId;
};

const getAssetGroupsLoading = (state: IState): boolean => {
  const {
    recordAsset: {
      loaders: { assetGroups },
    },
  } = state;
  return assetGroups;
};

const getSelectedAssetPlan = (state: IState): ISelectedAssetPlan => {
  const {
    recordAsset: { selectedAssetPlan },
  } = state;
  return selectedAssetPlan;
};

const getAssetDetails = (state: IState): Asset | null => {
  const {
    recordAsset: { assetDetails },
  } = state;
  return ObjectMapper.deserialize(Asset, assetDetails);
};

const getSpaceTypes = (state: IState): SpaceType[] => {
  const {
    recordAsset: { assetGroups, assetDetails },
  } = state;
  let spaceType: SpaceType[] = [];

  ObjectMapper.deserializeArray(AssetGroup, assetGroups).forEach((item) => {
    if (assetDetails?.asset_group.id === item.id) {
      spaceType = item.spaceTypes;
    }
  });

  spaceType.forEach((item) => {
    assetDetails?.spaces.forEach((space) => {
      if (item.id === space.id) {
        item.unitCount = space.count;
        item.description = space.description ? space.description : '';
      }
    });
  });

  return spaceType;
};

const getMaintenanceUnits = (state: IState): { label: string; value: number }[] => {
  const { maintenanceUnits } = state.recordAsset;
  const units = ObjectMapper.deserializeArray(Unit, maintenanceUnits);
  return units.map((unit) => ({ label: unit.label, value: unit.id }));
};

const getLastVisitedStep = (state: IState): ILastVisitedStep | null => {
  const {
    recordAsset: { assetDetails },
  } = state;
  if (!assetDetails) return null;
  return assetDetails.last_visited_step;
};

const getAssetGroupId = (state: IState): number => {
  const {
    recordAsset: { assetDetails },
  } = state;
  return assetDetails?.asset_group.id ?? 0;
};

const getCountryId = (state: IState): number => {
  const {
    recordAsset: { assetDetails },
  } = state;
  return assetDetails?.country.id ?? 0;
};

const getValueAddedServices = (state: IState): ValueAddedService[] => {
  const {
    recordAsset: { valueAddedServices },
  } = state;

  return ObjectMapper.deserializeArray(ValueAddedService, valueAddedServices);
};

const getValueAddedService = (state: IState, planId: string): ValueAddedService => {
  const {
    recordAsset: { valueAddedServices },
  } = state;

  const services = ObjectMapper.deserializeArray(ValueAddedService, valueAddedServices);

  const valueAddedService = services.find((item) => item.valueBundle.id === Number(planId));
  if (valueAddedService) {
    return valueAddedService;
  }
  return new ValueAddedService();
};

const getCity = (state: IState): string => {
  const {
    recordAsset: { assetDetails },
  } = state;
  return assetDetails?.city_name ?? '';
};

const getEditPropertyFlowDetails = (state: IState): IEditPropertyFlow => {
  const {
    recordAsset: { editPropertyFlow },
  } = state;
  return editPropertyFlow;
};

const getSelectedImages = (state: IState): AssetGallery[] => {
  const {
    recordAsset: { selectedImages },
  } = state;
  return selectedImages;
};
const getRecordAssetLoaders = (state: IState): IRecordAssetState['loaders'] => {
  return state.recordAsset.loaders;
};

export const RecordAssetSelectors = {
  getLoadingState,
  getAssetPlans,
  getAssetGroups,
  getAssetGroupsLoading,
  getCurrentAssetId,
  getSelectedAssetPlan,
  getSpaceTypes,
  getAssetDetails,
  getMaintenanceUnits,
  getLastVisitedStep,
  getAssetGroupId,
  getCountryId,
  getValueAddedServices,
  getValueAddedService,
  getCity,
  getEditPropertyFlowDetails,
  getSelectedImages,
  getRecordAssetLoaders,
};
