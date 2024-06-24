/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { put, takeEvery, call } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { PortfolioActions, PortfolioActionTypes } from '@homzhub/common/src/modules/portfolio/actions';
import {
  IGetHistoryParam,
  IGetPropertiesPayload,
  IGetTenanciesPayload,
} from '@homzhub/common/src/modules/portfolio/interfaces';

function* getTenancies(action: IFluxStandardAction<IGetTenanciesPayload>) {
  const { payload } = action;
  try {
    const response = yield call(PortfolioRepository.getUserTenancies);
    yield put(PortfolioActions.getTenanciesDetailsSuccess(response));
    if (payload) {
      payload.onCallback({ status: true });
    }
  } catch (err) {
    if (payload) {
      payload.onCallback({ status: false });
    }
    const error = ErrorUtils.getErrorMessage(err.details);
    AlertHelper.error({ message: error, statusCode: err.details.statusCode });
    yield put(PortfolioActions.getTenanciesDetailsFailure(error));
  }
}

function* getProperties(action: IFluxStandardAction<IGetPropertiesPayload>) {
  if (!action.payload) {
    AlertHelper.error({ message: 'Payload missing' });
    return;
  }
  const { onCallback } = action.payload;
  try {
    const response = yield call(PortfolioRepository.getPortfolioAssets);
    yield put(PortfolioActions.getPropertyDetailsSuccess(response));
    onCallback({ status: true });
  } catch (err) {
    onCallback({ status: false });
    const error = ErrorUtils.getErrorMessage(err.details);
    AlertHelper.error({ message: error, statusCode: err.details.statusCode });
    yield put(PortfolioActions.getPropertyDetailsFailure(error));
  }
}

function* getTenantHistory(action: IFluxStandardAction<IGetHistoryParam>) {
  if (!action.payload) {
    AlertHelper.error({ message: 'Payload missing' });
    return;
  }
  const { id, onCallback, data } = action.payload;
  try {
    const response = yield call(PortfolioRepository.getTenantHistory, id, data);
    yield put(PortfolioActions.getTenantHistorySuccess(response));
    onCallback({ status: true });
  } catch (err) {
    onCallback({ status: false });
    const error = ErrorUtils.getErrorMessage(err.details);
    AlertHelper.error({ message: error, statusCode: err.details.statusCode });
    yield put(PortfolioActions.getTenantHistoryFailure(error));
  }
}

export function* watchPortfolio() {
  yield takeEvery(PortfolioActionTypes.GET.TENANCIES_DETAILS, getTenancies);
  yield takeEvery(PortfolioActionTypes.GET.PROPERTY_DETAILS, getProperties);
  yield takeEvery(PortfolioActionTypes.GET.TENANT_HISTORY, getTenantHistory);
}
