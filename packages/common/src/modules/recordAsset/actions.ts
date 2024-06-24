import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { AssetGroup, IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { AssetPlan, IAssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import {
  ISelectedValueServices,
  IValueAddedServices,
  ValueAddedService,
  IGetServicesByIds,
} from '@homzhub/common/src/domain/models/ValueAddedService';
import { Unit, IUnit } from '@homzhub/common/src/domain/models/Unit';

const actionTypePrefix = 'RecordAsset/';

export const RecordAssetActionTypes = {
  GET: {
    ASSET_GROUPS: `${actionTypePrefix}ASSET_GROUPS`,
    ASSET_GROUPS_SUCCESS: `${actionTypePrefix}ASSET_GROUPS_SUCCESS`,
    ASSET_GROUPS_FAILURE: `${actionTypePrefix}ASSET_GROUPS_FAILURE`,
    ASSET_PLAN_LIST: `${actionTypePrefix}ASSET_PLAN_LIST`,
    ASSET_PLAN_LIST_SUCCESS: `${actionTypePrefix}ASSET_PLAN_LIST_SUCCESS`,
    ASSET_PLAN_LIST_FAILURE: `${actionTypePrefix}ASSET_PLAN_LIST_FAILURE`,
    ASSET_BY_ID: `${actionTypePrefix}ASSET_BY_ID`,
    ASSET_BY_ID_SUCCESS: `${actionTypePrefix}ASSET_BY_ID_SUCCESS`,
    ASSET_BY_ID_FAILURE: `${actionTypePrefix}ASSET_BY_ID_FAILURE`,
    MAINTENANCE_UNITS: `${actionTypePrefix}MAINTENANCE_UNITS`,
    MAINTENANCE_UNITS_SUCCESS: `${actionTypePrefix}MAINTENANCE_UNITS_SUCCESS`,
    VALUE_ADDED_SERVICES: `${actionTypePrefix}VALUE_ADDED_SERVICES`,
    VALUE_ADDED_SERVICES_SUCCESS: `${actionTypePrefix}VALUE_ADDED_SERVICES_SUCCESS`,
  },
  SET: {
    ASSET_ID: `${actionTypePrefix}ASSET_ID`,
    SELECTED_PLAN: `${actionTypePrefix}SELECTED_PLAN`,
    SELECTED_VALUE_SERVICES: `${actionTypePrefix}SELECTED_VALUE_SERVICES`,
    EDIT_PROPERTY_FLOW: `${actionTypePrefix}EDIT_PROPERTY_FLOW`,
    EDIT_PROPERTY_FLOW_BOTTOM_SHEET: `${actionTypePrefix}EDIT_PROPERTY_FLOW_BOTTOM_SHEET`,
    SELECTED_IMAGE: `${actionTypePrefix}SELECTED_IMAGE`,
  },
  CLEAR_ASSET_DATA: `${actionTypePrefix}CLEAR_ASSET_DATA`,
  RESET: `${actionTypePrefix}RESET`,
};

const setSelectedPlan = (payload: ISelectedAssetPlan): IFluxStandardAction<ISelectedAssetPlan> => ({
  type: RecordAssetActionTypes.SET.SELECTED_PLAN,
  payload,
});

const setAssetId = (payload: number): IFluxStandardAction<number> => ({
  type: RecordAssetActionTypes.SET.ASSET_ID,
  payload,
});

const getAssetGroups = (): IFluxStandardAction => ({
  type: RecordAssetActionTypes.GET.ASSET_GROUPS,
});

const getAssetGroupsSuccess = (payload: AssetGroup[]): IFluxStandardAction<IAssetGroup[]> => ({
  type: RecordAssetActionTypes.GET.ASSET_GROUPS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getAssetGroupsFailure = (error: string): IFluxStandardAction => ({
  type: RecordAssetActionTypes.GET.ASSET_GROUPS_FAILURE,
  error,
});

const getAssetPlanList = (): IFluxStandardAction => {
  return {
    type: RecordAssetActionTypes.GET.ASSET_PLAN_LIST,
  };
};

const getAssetPlanListSuccess = (data: AssetPlan[]): IFluxStandardAction<IAssetPlan[]> => {
  return {
    type: RecordAssetActionTypes.GET.ASSET_PLAN_LIST_SUCCESS,
    payload: ObjectMapper.serializeArray(data),
  };
};

const getAssetPlanListFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: RecordAssetActionTypes.GET.ASSET_PLAN_LIST_FAILURE,
    error,
  };
};

const getAssetById = (): IFluxStandardAction => ({
  type: RecordAssetActionTypes.GET.ASSET_BY_ID,
});

const getAssetByIdSuccess = (payload: Asset): IFluxStandardAction<IAsset> => ({
  type: RecordAssetActionTypes.GET.ASSET_BY_ID_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getAssetByIdFailure = (error: string): IFluxStandardAction => ({
  type: RecordAssetActionTypes.GET.ASSET_BY_ID_FAILURE,
  error,
});

const getMaintenanceUnits = (): IFluxStandardAction => ({
  type: RecordAssetActionTypes.GET.MAINTENANCE_UNITS,
});

const getMaintenanceUnitsSuccess = (payload: Unit[]): IFluxStandardAction<IUnit[]> => ({
  type: RecordAssetActionTypes.GET.MAINTENANCE_UNITS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getValueAddedServices = (payload?: IGetServicesByIds): IFluxStandardAction<IGetServicesByIds> => ({
  type: RecordAssetActionTypes.GET.VALUE_ADDED_SERVICES,
  payload,
});

const getValueAddedServicesSuccess = (payload: ValueAddedService[]): IFluxStandardAction<IValueAddedServices[]> => ({
  type: RecordAssetActionTypes.GET.VALUE_ADDED_SERVICES_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const setValueAddedServices = (payload: ISelectedValueServices): IFluxStandardAction<ISelectedValueServices> => {
  return {
    type: RecordAssetActionTypes.SET.SELECTED_VALUE_SERVICES,
    payload,
  };
};

const setEditPropertyFlow = (payload: boolean): IFluxStandardAction<boolean> => ({
  type: RecordAssetActionTypes.SET.EDIT_PROPERTY_FLOW,
  payload,
});

const toggleEditPropertyFlowBottomSheet = (payload: boolean): IFluxStandardAction<boolean> => ({
  type: RecordAssetActionTypes.SET.EDIT_PROPERTY_FLOW_BOTTOM_SHEET,
  payload,
});

const setSelectedImages = (payload: AssetGallery[]): IFluxStandardAction<AssetGallery[]> => ({
  type: RecordAssetActionTypes.SET.SELECTED_IMAGE,
  payload,
});

const clearAssetData = (): IFluxStandardAction => ({
  type: RecordAssetActionTypes.CLEAR_ASSET_DATA,
});

const resetState = (): IFluxStandardAction => ({
  type: RecordAssetActionTypes.RESET,
});

export type RecordAssetPayloadTypes =
  | string
  | number
  | IAssetPlan[]
  | IAssetGroup[]
  | IUnit[]
  | ISelectedAssetPlan
  | IValueAddedServices[]
  | ISelectedValueServices
  | AssetGallery[]
  | IAsset
  | boolean
  | undefined;

export const RecordAssetActions = {
  setSelectedPlan,
  setAssetId,
  getAssetGroups,
  getAssetGroupsSuccess,
  getAssetGroupsFailure,
  getAssetPlanList,
  getAssetPlanListSuccess,
  getAssetPlanListFailure,
  getAssetById,
  getAssetByIdSuccess,
  getAssetByIdFailure,
  getMaintenanceUnits,
  getMaintenanceUnitsSuccess,
  getValueAddedServices,
  getValueAddedServicesSuccess,
  setValueAddedServices,
  setEditPropertyFlow,
  toggleEditPropertyFlowBottomSheet,
  resetState,
  setSelectedImages,
  clearAssetData,
};
