/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { ServiceActions, ServiceActionTypes } from '@homzhub/common/src/modules/service/actions';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { VoidGenerator } from '@homzhub/common/src/modules/interfaces';

export function* getServiceCities(): VoidGenerator {
  try {
    const response = yield call(ServiceRepository.getServiceCities);
    yield put(ServiceActions.getServiceCitiesSuccess(response as Unit[]));
  }catch (e: any) {    yield put(ServiceActions.getServiceCitiesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getServiceAssets(): VoidGenerator {
  try {
    const response = yield call(AssetRepository.getValueServicesAssetList);
    yield put(ServiceActions.getServiceAssetsSuccess(response as Asset[]));
  }catch (e: any) {    yield put(ServiceActions.getServiceCitiesFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* watcService() {
  yield takeLatest(ServiceActionTypes.GET.SERVICE_CITIES, getServiceCities);
  yield takeLatest(ServiceActionTypes.GET.SERVICE_ASSETS, getServiceAssets);
}
