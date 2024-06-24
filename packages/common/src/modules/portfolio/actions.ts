import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import {
  IGetHistoryParam,
  IGetPropertiesPayload,
  IGetTenanciesPayload,
  ISetAssetPayload,
} from '@homzhub/common/src/modules/portfolio/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { TenantInfo } from '@homzhub/common/src/domain/models/TenantInfo';

const actionTypePrefix = 'Portfolio/';

export const PortfolioActionTypes = {
  GET: {
    TENANCIES_DETAILS: `${actionTypePrefix}TENANCIES_DETAILS`,
    TENANCIES_DETAILS_SUCCESS: `${actionTypePrefix}TENANCIES_DETAILS_SUCCESS`,
    TENANCIES_DETAILS_FAILURE: `${actionTypePrefix}TENANCIES_DETAILS_FAILURE`,
    PROPERTY_DETAILS: `${actionTypePrefix}PROPERTY_DETAILS`,
    PROPERTY_DETAILS_SUCCESS: `${actionTypePrefix}PROPERTY_DETAILS_SUCCESS`,
    PROPERTY_DETAILS_FAILURE: `${actionTypePrefix}PROPERTY_DETAILS_FAILURE`,
    TENANT_HISTORY: `${actionTypePrefix}TENANT_HISTORY`,
    TENANT_HISTORY_SUCCESS: `${actionTypePrefix}TENANT_HISTORY_SUCCESS`,
    TENANT_HISTORY_FAILURE: `${actionTypePrefix}TENANT_HISTORY_FAILURE`,
  },
  SET: {
    CURRENT_ASSET: `${actionTypePrefix}CURRENT_ASSET`,
    CURRENT_FILTER: `${actionTypePrefix}CURRENT_FILTER`,
    INITIAL_STATE: `${actionTypePrefix}INITIAL_STATE`,
  },
};
const getTenanciesDetails = (payload?: IGetTenanciesPayload): IFluxStandardAction<IGetTenanciesPayload> => {
  return {
    type: PortfolioActionTypes.GET.TENANCIES_DETAILS,
    payload,
  };
};

const getTenanciesDetailsSuccess = (data: Asset[]): IFluxStandardAction<Asset[]> => {
  return {
    type: PortfolioActionTypes.GET.TENANCIES_DETAILS_SUCCESS,
    payload: data,
  };
};

const getTenanciesDetailsFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: PortfolioActionTypes.GET.TENANCIES_DETAILS_FAILURE,
    error,
  };
};

const getPropertyDetails = (payload: IGetPropertiesPayload): IFluxStandardAction<IGetPropertiesPayload> => {
  return {
    type: PortfolioActionTypes.GET.PROPERTY_DETAILS,
    payload,
  };
};

const getPropertyDetailsSuccess = (data: Asset[]): IFluxStandardAction<Asset[]> => {
  return {
    type: PortfolioActionTypes.GET.PROPERTY_DETAILS_SUCCESS,
    payload: data,
  };
};

const getPropertyDetailsFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: PortfolioActionTypes.GET.PROPERTY_DETAILS_FAILURE,
    error,
  };
};

const setCurrentAsset = (payload: ISetAssetPayload): IFluxStandardAction<ISetAssetPayload> => ({
  type: PortfolioActionTypes.SET.CURRENT_ASSET,
  payload,
});

const getTenantHistory = (payload: IGetHistoryParam): IFluxStandardAction<IGetHistoryParam> => {
  return {
    type: PortfolioActionTypes.GET.TENANT_HISTORY,
    payload,
  };
};

const getTenantHistorySuccess = (data: TenantInfo[]): IFluxStandardAction<TenantInfo[]> => {
  return {
    type: PortfolioActionTypes.GET.TENANT_HISTORY_SUCCESS,
    payload: data,
  };
};

const getTenantHistoryFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: PortfolioActionTypes.GET.TENANT_HISTORY_FAILURE,
    error,
  };
};

const setCurrentFilter = (payload: Filters): IFluxStandardAction<Filters> => ({
  type: PortfolioActionTypes.SET.CURRENT_FILTER,
  payload,
});

const setInitialState = (): IFluxStandardAction => ({
  type: PortfolioActionTypes.SET.INITIAL_STATE,
});

export type PortfolioPayloadTypes = string | ISetAssetPayload | Asset[] | undefined | TenantInfo[] | Filters;
export const PortfolioActions = {
  getTenanciesDetails,
  getTenanciesDetailsSuccess,
  getTenanciesDetailsFailure,
  getPropertyDetails,
  getPropertyDetailsSuccess,
  getPropertyDetailsFailure,
  setCurrentAsset,
  getTenantHistory,
  getTenantHistorySuccess,
  getTenantHistoryFailure,
  setCurrentFilter,
  setInitialState,
};
