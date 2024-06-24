import { mapKeys } from 'lodash';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { TenantInfo } from '@homzhub/common/src/domain/models/TenantInfo';
import { IDataObject, IPortfolioState, ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

const getTenancies = (state: IState): Asset[] => {
  const {
    portfolio: { tenancies },
  } = state;

  if (!tenancies) return [];
  return tenancies;
};

const getProperties = (state: IState): Asset[] => {
  const {
    portfolio: { properties },
  } = state;

  if (!properties) return [];
  return properties;
};

const getPropertiesById = (state: IState): Asset[] => {
  const {
    portfolio: { properties },
  } = state;

  if (!properties) return [];
  const data: IDataObject = mapKeys(properties, 'id');
  return Object.values(data);
};

const getTenanciesById = (state: IState): Asset[] => {
  const {
    portfolio: { tenancies },
  } = state;

  if (!tenancies) return [];
  const data: IDataObject = mapKeys(tenancies, 'id');
  return Object.values(data);
};

const getTenanciesLoadingState = (state: IState): boolean => {
  const {
    portfolio: {
      loaders: { tenancies },
    },
  } = state;
  return tenancies;
};

const getPropertiesLoadingState = (state: IState): boolean => {
  const {
    portfolio: {
      loaders: { properties },
    },
  } = state;
  return properties;
};

const getCurrentAssetPayload = (state: IState): ISetAssetPayload => {
  const {
    portfolio: { currentAsset },
  } = state;

  return currentAsset;
};

const getCurrentAssetId = (state: IState): number => {
  const {
    portfolio: { currentAsset },
  } = state;

  return currentAsset.asset_id;
};

const getAssetById = (state: IState): Asset | null => {
  const {
    portfolio: { currentAsset, tenancies, properties },
  } = state;
  if (!tenancies || !properties) return null;

  if (currentAsset.dataType === DataType.TENANCIES) {
    return tenancies[currentAsset.asset_id];
  }
  return properties[currentAsset.asset_id];
};

const getTenantHistory = (state: IState): TenantInfo[] => {
  const {
    portfolio: { tenantHistory },
  } = state;
  if (!tenantHistory) return [];
  return tenantHistory;
};

const getCurrentFilter = (state: IState): Filters => {
  const {
    portfolio: { currentFilter },
  } = state;

  return currentFilter;
};
const getPortfolioLoaders = (state: IState): IPortfolioState['loaders'] => {
  return state.portfolio.loaders;
};

export const PortfolioSelectors = {
  getTenancies,
  getProperties,
  getTenanciesLoadingState,
  getPropertiesLoadingState,
  getCurrentAssetId,
  getAssetById,
  getTenantHistory,
  getCurrentFilter,
  getCurrentAssetPayload,
  getPortfolioLoaders,
  getPropertiesById,
  getTenanciesById,
};
