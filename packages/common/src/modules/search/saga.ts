/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, debounce, put, takeEvery } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AnalyticsHelper } from '@homzhub/common/src/utils/AnalyticsHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { SearchRepository } from '@homzhub/common/src/domain/repositories/SearchRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { AssetService } from '@homzhub/common/src/services/AssetService';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { SearchActions, SearchActionTypes } from '@homzhub/common/src/modules/search/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

export function* getFilterDetails(action: IFluxStandardAction<IFilter>) {
  try {
    const data = yield call(SearchRepository.getFilterDetails, action.payload as IFilter);
    yield put(SearchActions.getFilterDetailsSuccess(data));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error });
    yield put(SearchActions.getFilterDetailsFailure(error));
  }
}

export function* getPropertiesDetails() {
  const assetFilters: IFilter = yield select(SearchSelector.getFilters);
  const { asset_transaction_type } = assetFilters;

  let trackData = AnalyticsHelper.getSearchTrackData(assetFilters);

  try {
    const filter = AssetService.constructAssetSearchPayload(assetFilters);

    let count = 0;
    if (asset_transaction_type === 0) {
      // RENT FLOW
      const data = yield call(SearchRepository.getPropertiesForLeaseListings, filter);
      count = data.count;
      yield put(SearchActions.getPropertiesSuccess(data));
    } else {
      // SALE FLOW
      const data = yield call(SearchRepository.getPropertiesForSaleListings, filter);
      count = data.count;
      yield put(SearchActions.getPropertiesSuccess(data));
    }
    const historyPayload = AssetService.getSearchHistoryPayload(assetFilters, count);
    yield call(SearchRepository.addSearchHistory, historyPayload);

    // Analytics
    yield call(AnalyticsService.track, EventType.SearchSuccess, trackData);
    if (count === 0) {
      yield call(AnalyticsService.track, EventType.ZeroSearchResult, trackData);
    }
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details, true);
    trackData = {
      ...trackData,
      error,
    };
    yield call(AnalyticsService.track, EventType.SearchFailure, trackData);
    AlertHelper.error({ message: error });
    yield put(SearchActions.getPropertiesFailure(error));
  }
}

export function* getPropertiesListViewDetails() {
  const assetFilters: IFilter = yield select(SearchSelector.getFilters);
  const { asset_transaction_type } = assetFilters;

  let trackData = AnalyticsHelper.getSearchTrackData(assetFilters);
  try {
    const filter = AssetService.constructAssetSearchPayload(assetFilters);
    let count = 0;
    if (asset_transaction_type === 0) {
      // RENT FLOW
      const data = yield call(SearchRepository.getPropertiesForLeaseListings, filter);
      count = data.count;
      yield put(SearchActions.getPropertiesListViewSuccess(data));
    } else {
      // SALE FLOW
      const data = yield call(SearchRepository.getPropertiesForSaleListings, filter);
      count = data.count;
      yield put(SearchActions.getPropertiesListViewSuccess(data));
    }
    const historyPayload = AssetService.getSearchHistoryPayload(assetFilters, count);
    yield call(SearchRepository.addSearchHistory, historyPayload);

    // Analytics
    yield call(AnalyticsService.track, EventType.SearchSuccess, trackData);
    if (count === 0) {
      yield call(AnalyticsService.track, EventType.ZeroSearchResult, trackData);
    }
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    trackData = {
      ...trackData,
      error,
    };
    yield call(AnalyticsService.track, EventType.SearchFailure, trackData);
    AlertHelper.error({ message: error });
    yield put(SearchActions.getPropertiesListViewFailure(error));
  }
}

export function* watchSearch() {
  yield takeEvery(SearchActionTypes.GET.FILTER_DETAILS, getFilterDetails);
  yield debounce(100, SearchActionTypes.GET.PROPERTIES, getPropertiesDetails);
  yield debounce(100, SearchActionTypes.GET.PROPERTIES_LIST_VIEW, getPropertiesListViewDetails);
}
