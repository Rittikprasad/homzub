/* eslint-disable @typescript-eslint/no-explicit-any */

import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IAssetSearch, AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { FilterDetail, IFilterDetails } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ILocationParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { ILatLng } from '@homzhub/common/src/modules/search/interface';

const actionTypePrefix = 'Search/';

export const SearchActionTypes = {
  GET: {
    FILTER_DETAILS: `${actionTypePrefix}FILTER_DETAILS`,
    FILTER_DETAILS_SUCCESS: `${actionTypePrefix}FILTER_DETAILS_SUCCESS`,
    FILTER_DETAILS_FAILURE: `${actionTypePrefix}FILTER_DETAILS_FAILURE`,
    PROPERTIES: `${actionTypePrefix}PROPERTIES`,
    PROPERTIES_SUCCESS: `${actionTypePrefix}PROPERTIES_SUCCESS`,
    PROPERTIES_FAILURE: `${actionTypePrefix}PROPERTIES_FAILURE`,
    PROPERTIES_LIST_VIEW: `${actionTypePrefix}PROPERTIES_LIST_VIEW`,
    PROPERTIES_LIST_VIEW_SUCCESS: `${actionTypePrefix}PROPERTIES_LIST_VIEW_SUCCESS`,
    PROPERTIES_LIST_VIEW_FAILURE: `${actionTypePrefix}PROPERTIES_LIST_VIEW_FAILURE`,
  },
  SET: {
    FILTER: `${actionTypePrefix}SET_FILTER`,
    INITIAL_FILTERS: `${actionTypePrefix}SET_INITIAL_FILTERS`,
    INITIAL_STATE: `${actionTypePrefix}SET_INITIAL_STATE`,
    INITIAL_MISCELLANEOUS: `${actionTypePrefix}SET_INITIAL_MISCELLANEOUS`,
    SEARCH_LATLNG: `${actionTypePrefix}SET_SEARCH_LATLNG`,
    LOCALITIES: `${actionTypePrefix}LOCALITIES`,
    UPDATE_LOCALITIES: `${actionTypePrefix}UPDATE_LOCALITIES`,
  },
  CLEAR_PROPERTIES: `${actionTypePrefix}CLEAR_PROPERTIES`,
  CLEAR_LOCALITIES: `${actionTypePrefix}CLEAR_LOCALITIES`,
};

const getFilterDetails = (payload: IFilter): IFluxStandardAction<IFilter> => {
  return {
    type: SearchActionTypes.GET.FILTER_DETAILS,
    payload,
  };
};

const getFilterDetailsSuccess = (data: FilterDetail): IFluxStandardAction<IFilterDetails> => {
  return {
    type: SearchActionTypes.GET.FILTER_DETAILS_SUCCESS,
    payload: ObjectMapper.serialize(data),
  };
};

const getFilterDetailsFailure = (error: string): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.FILTER_DETAILS_FAILURE,
    error,
  };
};

const setFilter = (payload: IFilter): IFluxStandardAction<IFilter> => {
  return {
    type: SearchActionTypes.SET.FILTER,
    payload,
  };
};

const getProperties = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.PROPERTIES,
  };
};

const getPropertiesSuccess = (asset: AssetSearch): IFluxStandardAction<IAssetSearch> => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_SUCCESS,
    payload: ObjectMapper.serialize(asset),
  };
};

const getPropertiesFailure = (error: string): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_FAILURE,
    error,
  };
};

const setInitialFilters = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.SET.INITIAL_FILTERS,
  };
};

const setInitialState = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.SET.INITIAL_STATE,
  };
};

const getPropertiesListView = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_LIST_VIEW,
  };
};

const getPropertiesListViewSuccess = (asset: AssetSearch): IFluxStandardAction<IAssetSearch> => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_LIST_VIEW_SUCCESS,
    payload: ObjectMapper.serialize(asset),
  };
};

const getPropertiesListViewFailure = (error: string): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_LIST_VIEW_FAILURE,
    error,
  };
};

const setInitialMiscellaneous = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.SET.INITIAL_MISCELLANEOUS,
  };
};

const setSearchLatLng = (latLng: ILatLng): IFluxStandardAction<ILatLng> => {
  return {
    type: SearchActionTypes.SET.SEARCH_LATLNG,
    payload: latLng,
  };
};
const clearProperties = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.CLEAR_PROPERTIES,
  };
};

const setLocalities = (payload: ILocationParam[]): IFluxStandardAction<ILocationParam[]> => {
  return {
    type: SearchActionTypes.SET.LOCALITIES,
    payload,
  };
};

const removeLocality = (payload: string): IFluxStandardAction<string> => {
  return {
    type: SearchActionTypes.SET.UPDATE_LOCALITIES,
    payload,
  };
};

const clearLocalities = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.CLEAR_LOCALITIES,
  };
};

export type SearchPayloadTypes =
  | string
  | number
  | IAssetSearch
  | IFilter
  | IFilterDetails
  | ILatLng
  | undefined
  | ILocationParam;

export const SearchActions = {
  getFilterDetails,
  getFilterDetailsSuccess,
  getFilterDetailsFailure,
  setFilter,
  getProperties,
  getPropertiesSuccess,
  getPropertiesFailure,
  setInitialFilters,
  setInitialState,
  getPropertiesListView,
  getPropertiesListViewSuccess,
  getPropertiesListViewFailure,
  setInitialMiscellaneous,
  setSearchLatLng,
  clearProperties,
  setLocalities,
  removeLocality,
  clearLocalities,
};
