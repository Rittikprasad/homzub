/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { takeEvery, call, put } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { MessageRepository } from '@homzhub/common/src/domain/repositories/MessageRepository';
import { CommonActionTypes, CommonActions } from '@homzhub/common/src/modules/common/actions';
import { PillarTypes } from '@homzhub/common/src/domain/models/Pillar';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';

function* getCountries() {
  try {
    const response = yield call(CommonRepository.getCountryCodes);
    yield put(CommonActions.getCountriesSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    yield put(CommonActions.getCountriesFaliure(error));
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
  }
}

function* getMessages(action: IFluxStandardAction<IGetMessageParam>) {
  try {
    const response = yield call(MessageRepository.getMessages, action.payload as IGetMessageParam);
    yield put(CommonActions.getMessagesSuccess({ response, isNew: action.payload?.isNew }));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
  }
}

function* getGroupMessages() {
  try {
    const response = yield call(MessageRepository.getGroupMessages);
    yield put(CommonActions.getGroupMessageSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
  }
}

function* getPillars(action: IFluxStandardAction<PillarTypes>) {
  try {
    const response = yield call(CommonRepository.getPillars, action.payload as PillarTypes);
    yield put(CommonActions.getPillarsSuccess(response));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    yield put(CommonActions.getPillarsFailure());
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
  }
}

export function* watchCommonActions() {
  yield takeEvery(CommonActionTypes.GET.COUNTRIES, getCountries);
  yield takeEvery(CommonActionTypes.GET.MESSAGES, getMessages);
  yield takeEvery(CommonActionTypes.GET.GROUP_MESSAGES, getGroupMessages);
  yield takeEvery(CommonActionTypes.GET.PILLARS, getPillars);
}
