import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IRecordAssetState } from '@homzhub/common/src/modules/recordAsset/interface';
import { RecordAssetActionTypes, RecordAssetPayloadTypes } from '@homzhub/common/src/modules/recordAsset/actions';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { IAssetPlan, ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';
import {
  ISelectedValueServices,
  IValueAddedServices,
  ValueAddedService,
} from '@homzhub/common/src/domain/models/ValueAddedService';

export const initialRecordAssetState: IRecordAssetState = {
  assetId: -1,
  assetPlan: [],
  assetGroups: [],
  maintenanceUnits: [],
  assetDetails: null,
  selectedImages: [],
  selectedAssetPlan: {
    id: 0,
    selectedPlan: TypeOfPlan.RENT,
  },
  valueAddedServices: [],
  editPropertyFlow: {
    isEditPropertyFlow: false,
    showBottomSheet: false,
  },
  error: {
    assetPlan: '',
  },
  loaders: {
    assetPlan: false,
    assetGroups: false,
    assetDetails: false,
  },
};

const getValueServicesArray = (state: IRecordAssetState, payload: ISelectedValueServices): IValueAddedServices[] => {
  const { valueAddedServices } = state;

  const updatedServices = ObjectMapper.deserializeArray(ValueAddedService, valueAddedServices).map((service) => {
    if (payload.id === service.id) {
      service.value = payload.value;
    }

    return service;
  });

  return ObjectMapper.serializeArray(updatedServices);
};

export const recordAssetReducer = (
  state: IRecordAssetState = initialRecordAssetState,
  action: IFluxStandardAction<RecordAssetPayloadTypes>
): IRecordAssetState => {
  switch (action.type) {
    case RecordAssetActionTypes.GET.ASSET_GROUPS:
      return {
        ...state,
        ['assetGroups']: [],
        ['loaders']: { ...state.loaders, ['assetGroups']: true },
      };
    case RecordAssetActionTypes.GET.ASSET_GROUPS_SUCCESS:
      return {
        ...state,
        ['assetGroups']: action.payload as IAssetGroup[],
        ['loaders']: { ...state.loaders, ['assetGroups']: false },
      };
    case RecordAssetActionTypes.GET.ASSET_GROUPS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetGroups']: false },
      };
    case RecordAssetActionTypes.GET.ASSET_PLAN_LIST:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetPlan']: true },
        ['error']: { ...state.error, ['assetPlan']: '' },
      };
    case RecordAssetActionTypes.GET.ASSET_PLAN_LIST_SUCCESS:
      return {
        ...state,
        ['assetPlan']: action.payload as IAssetPlan[],
        ['loaders']: { ...state.loaders, ['assetPlan']: false },
      };
    case RecordAssetActionTypes.GET.ASSET_PLAN_LIST_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetPlan']: false },
        ['error']: { ...state.error, ['assetPlan']: action.error as string },
      };
    case RecordAssetActionTypes.GET.ASSET_BY_ID:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetDetails']: true },
      };
    case RecordAssetActionTypes.GET.ASSET_BY_ID_SUCCESS:
      return {
        ...state,
        ['assetDetails']: action.payload as IAsset,
        ['loaders']: { ...state.loaders, ['assetDetails']: false },
      };
    case RecordAssetActionTypes.GET.ASSET_BY_ID_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetDetails']: false },
      };
    case RecordAssetActionTypes.GET.MAINTENANCE_UNITS:
      return {
        ...state,
        ['maintenanceUnits']: [],
      };
    case RecordAssetActionTypes.GET.MAINTENANCE_UNITS_SUCCESS:
      return {
        ...state,
        ['maintenanceUnits']: action.payload as IUnit[],
      };
    case RecordAssetActionTypes.SET.ASSET_ID:
      return { ...state, ['assetId']: action.payload as number };
    case RecordAssetActionTypes.SET.SELECTED_PLAN:
      return { ...state, ['selectedAssetPlan']: action.payload as ISelectedAssetPlan };
    case RecordAssetActionTypes.SET.SELECTED_VALUE_SERVICES:
      return {
        ...state,
        ['valueAddedServices']: getValueServicesArray(state, action.payload as ISelectedValueServices),
      };
    case RecordAssetActionTypes.GET.VALUE_ADDED_SERVICES_SUCCESS:
      return {
        ...state,
        ['valueAddedServices']: action.payload as IValueAddedServices[],
      };
    case RecordAssetActionTypes.SET.EDIT_PROPERTY_FLOW:
      return {
        ...state,
        ['editPropertyFlow']: {
          ...state.editPropertyFlow,
          ['isEditPropertyFlow']: action.payload as boolean,
        },
      };
    case RecordAssetActionTypes.SET.EDIT_PROPERTY_FLOW_BOTTOM_SHEET:
      return {
        ...state,
        ['editPropertyFlow']: {
          ...state.editPropertyFlow,
          ['showBottomSheet']: action.payload as boolean,
        },
      };
    case RecordAssetActionTypes.SET.SELECTED_IMAGE:
      return { ...state, ['selectedImages']: action.payload as AssetGallery[] };
    case RecordAssetActionTypes.CLEAR_ASSET_DATA:
      return { ...state, ['assetDetails']: initialRecordAssetState.assetDetails };
    case RecordAssetActionTypes.RESET:
      return initialRecordAssetState;
    default:
      return state;
  }
};
