// @ts-nocheck
import { searchReducer as reducer, initialSearchState } from '@homzhub/common/src/modules/search/reducer';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { FilterData, SearchFilter } from '@homzhub/common/src/mocks/FilterData';
import { AssetSearchData } from '@homzhub/common/src/mocks/AssetDescription';

describe.skip('Search Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'INITIAL_STATE' })).toEqual(initialSearchState);
  });

  it('should handle get api calls', () => {
    [SearchActions.getFilterDetails(), SearchActions.getProperties(), SearchActions.getPropertiesListView()].forEach(
      (action) => {
        const state = reducer(initialSearchState, action);
        expect(state).toStrictEqual({
          ...initialSearchState,
          ['loaders']: { ...state.loaders, ['search']: true },
          ['error']: { ...state.error, ['search']: '' },
        });
      }
    );
  });

  it('should handle failure api calls', () => {
    [
      SearchActions.getFilterDetailsFailure('Test Error'),
      SearchActions.getPropertiesFailure('Test Error'),
      SearchActions.getPropertiesListViewFailure('Test Error'),
    ].forEach((action) => {
      const state = reducer(initialSearchState, action);
      expect(state).toStrictEqual({
        ...initialSearchState,
        ['loaders']: { ...state.loaders, ['search']: false },
        ['error']: { ...state.error, ['search']: 'Test Error' },
      });
    });
  });

  it('should set initial filters', () => {
    const state = reducer(initialSearchState, SearchActions.setInitialFilters());
    expect(state).toStrictEqual({
      ...initialSearchState,
      ['filter']: { ...state.filter, ...SearchFilter },
    });
  });

  it('should set initial state', () => {
    const state = reducer(initialSearchState, SearchActions.setInitialState());
    expect(state).toStrictEqual({
      ...initialSearchState,
    });
  });

  it('should set filter', () => {
    const state = reducer(initialSearchState, SearchActions.setFilter(SearchFilter));
    expect(state).toStrictEqual({
      ...initialSearchState,
      ['filter']: { ...state.filter, ...SearchFilter },
      ['loaders']: { ...state.loaders, ['search']: false },
    });
  });

  it.skip('should get filter details success', () => {
    const state = reducer(initialSearchState, SearchActions.getFilterDetailsSuccess(FilterData));
    expect(state).toStrictEqual({
      ...initialSearchState,
      ['filterDetails']: FilterData,
      ['loaders']: { ...state.loaders, ['search']: false },
    });
  });

  it.skip('should get properties success', () => {
    const state = reducer(initialSearchState, SearchActions.getPropertiesSuccess(AssetSearchData));
    expect(state).toStrictEqual({
      ...initialSearchState,
      ['properties']: AssetSearchData,
      ['loaders']: { ...state.loaders, ['search']: false },
    });
  });

  it.skip('should get properties success', () => {
    const state = reducer(initialSearchState, SearchActions.getPropertiesListViewSuccess(AssetSearchData));
    expect(state).toStrictEqual({
      ...initialSearchState,
      ['properties']: AssetSearchData,
      ['loaders']: { ...state.loaders, ['search']: false },
    });
  });
});
