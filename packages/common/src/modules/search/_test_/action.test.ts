import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { SearchActionTypes, SearchActions } from '@homzhub/common/src/modules/search/actions';
import { FilterData, SearchFilter } from '@homzhub/common/src/mocks/FilterData';
import { AssetSearchData } from '@homzhub/common/src/mocks/AssetDescription';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';

describe('Search Actions', () => {
  it('should get filter details', () => {
    const action = SearchActions.getFilterDetails({ asset_group: 2 });
    expect(action).toStrictEqual({
      type: SearchActionTypes.GET.FILTER_DETAILS,
      payload: { asset_group: 2 },
    });
  });

  it.skip('should get filter details success', () => {
    const action = SearchActions.getFilterDetailsSuccess(FilterData);
    expect(action).toStrictEqual({
      type: SearchActionTypes.GET.FILTER_DETAILS_SUCCESS,
      payload: FilterData,
    });
  });

  it('should get filter details error', () => {
    const action = SearchActions.getFilterDetailsFailure('Test Error');
    expect(action).toStrictEqual({
      type: SearchActionTypes.GET.FILTER_DETAILS_FAILURE,
      error: 'Test Error',
    });
  });

  it('should set filter', () => {
    const action = SearchActions.setFilter(SearchFilter);
    expect(action).toStrictEqual({
      type: SearchActionTypes.SET.FILTER,
      payload: SearchFilter,
    });
  });

  it('should get properties', () => {
    const action = SearchActions.getProperties();
    expect(action).toStrictEqual({
      type: SearchActionTypes.GET.PROPERTIES,
    });
  });

  // TODO: Figure out why this is breaking
  it.skip('should get properties success', () => {
    const assetSearch = ObjectMapper.deserialize(AssetSearch, AssetSearchData);
    const action = SearchActions.getPropertiesSuccess(assetSearch);
    expect(action).toEqual({
      type: SearchActionTypes.GET.PROPERTIES_SUCCESS,
      payload: AssetSearchData,
    });
  });

  it('should get properties error', () => {
    const action = SearchActions.getPropertiesFailure('Test Error');
    expect(action).toStrictEqual({
      type: SearchActionTypes.GET.PROPERTIES_FAILURE,
      error: 'Test Error',
    });
  });

  it('should set initial filters', () => {
    const action = SearchActions.setInitialFilters();
    expect(action).toStrictEqual({
      type: SearchActionTypes.SET.INITIAL_FILTERS,
    });
  });

  it('should set initial state', () => {
    const action = SearchActions.setInitialState();
    expect(action).toStrictEqual({
      type: SearchActionTypes.SET.INITIAL_STATE,
    });
  });

  it('should get property list view', () => {
    const action = SearchActions.getPropertiesListView();
    expect(action).toStrictEqual({
      type: SearchActionTypes.GET.PROPERTIES_LIST_VIEW,
    });
  });

  // TODO: Figure out why this is breaking
  it.skip('should get property list view success', () => {
    const assetSearch = ObjectMapper.deserialize(AssetSearch, AssetSearchData);
    const action = SearchActions.getPropertiesListViewSuccess(assetSearch);
    expect(action).toStrictEqual({
      type: SearchActionTypes.GET.PROPERTIES_LIST_VIEW_SUCCESS,
      payload: AssetSearchData,
    });
  });

  it('should get properties list view failure', () => {
    const action = SearchActions.getPropertiesListViewFailure('Test Error');
    expect(action).toStrictEqual({
      type: SearchActionTypes.GET.PROPERTIES_LIST_VIEW_FAILURE,
      error: 'Test Error',
    });
  });
});
