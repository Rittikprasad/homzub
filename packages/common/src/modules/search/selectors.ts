import { PickerItemProps } from 'react-native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Point } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { FilterDetail } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter, ITransactionRange } from '@homzhub/common/src/domain/models/Search';
import { ITransactionType } from '@homzhub/common/src/domain/models/Transaction';
import { ILocationParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';

const getFilterDetail = (state: IState): FilterDetail | null => {
  const {
    search: { filterDetails },
  } = state;
  return ObjectMapper.deserialize(FilterDetail, filterDetails);
};

const getFilters = (state: IState): IFilter => {
  const {
    search: { filter },
  } = state;
  return filter;
};

const getProperties = (state: IState): AssetSearch => {
  const {
    search: { properties },
  } = state;
  return ObjectMapper.deserialize(AssetSearch, properties);
};

const getLoadingState = (state: IState): boolean => {
  const {
    search: {
      loaders: { search },
    },
  } = state;
  return search;
};

const getCurrencyData = (state: IState): PickerItemProps[] => {
  const {
    search: { filterDetails },
  } = state;
  if (!filterDetails) {
    return [];
  }
  return filterDetails.currency.map((item: ICurrency) => {
    return {
      label: item.currency_code,
      value: item.currency_code,
    };
  });
};

const getPriceRange = (state: IState): ITransactionRange => {
  const {
    search: { filterDetails, filter },
  } = state;
  let priceRange = { min: 0, max: 10 };

  if (filterDetails) {
    const {
      filters: { transaction_type },
    } = filterDetails;

    transaction_type.forEach((item: ITransactionType, index: number) => {
      if (index === filter.asset_transaction_type) {
        priceRange = { min: item.min_price, max: item.max_price };
      }
    });
  }

  return priceRange;
};

const getSearchLocationLatLong = (state: IState): Point => {
  const {
    search: {
      filter: { search_latitude, search_longitude },
    },
  } = state;

  return {
    lat: search_latitude ?? 0,
    lng: search_longitude ?? 0,
  };
};

const getLocationLatLong = (state: IState): Point => {
  const {
    search: {
      searchBar: {
        latLng: { lat, lng },
      },
    },
  } = state;

  return {
    lat: lat ?? 0,
    lng: lng ?? 0,
  };
};

const getSearchAddress = (state: IState): string => {
  const {
    search: {
      filter: { search_address },
    },
  } = state;

  return search_address ?? '';
};
const getSearchLoaders = (state: IState): ISearchState['loaders'] => {
  return state.search.loaders;
};

const getLocalities = (state: IState): ILocationParam[] => {
  return state.search.localities;
};

export const SearchSelector = {
  getProperties,
  getFilterDetail,
  getFilters,
  getLoadingState,
  getCurrencyData,
  getPriceRange,
  getSearchLocationLatLong,
  getSearchAddress,
  getLocationLatLong,
  getSearchLoaders,
  getLocalities,
};
