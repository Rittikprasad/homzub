import { IState } from '@homzhub/common/src/modules/interfaces';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialRecordAssetState } from '@homzhub/common/src/modules/recordAsset/reducer';
import { initialAssetState } from '@homzhub/common/src/modules/asset/reducer';
import { initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { FilterData, SearchFilter } from '@homzhub/common/src/mocks/FilterData';
import { AssetSearchData } from '@homzhub/common/src/mocks/AssetDescription';

const state: IState = {
  user: {
    ...initialUserState,
  },
  asset: {
    ...initialAssetState,
  },
  recordAsset: {
    ...initialRecordAssetState,
  },
  search: {
    ...initialSearchState,
    filterDetails: FilterData,
    filter: SearchFilter,
    loaders: {
      search: false,
    },
  },
};

describe.skip('Search Selector', () => {
  it('should get filter details', () => {
    expect(SearchSelector.getFilterDetail(state)).toBe(FilterData);
  });

  it('should get filters', () => {
    expect(SearchSelector.getFilters(state)).toBe(SearchFilter);
  });

  it.skip('should get properties', () => {
    expect(SearchSelector.getProperties(state)).toBe(AssetSearchData);
  });

  it('should get loading state', () => {
    expect(SearchSelector.getLoadingState(state)).toBe(false);
  });
});
