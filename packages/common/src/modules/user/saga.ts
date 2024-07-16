/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DeviceUtils } from '@homzhub/common/src/utils/DeviceUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { UserActions, UserActionTypes } from '@homzhub/common/src/modules/user/actions';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { User } from '@homzhub/common/src/domain/models/User';
import { UserPreferences, UserPreferencesKeys } from '@homzhub/common/src/domain/models/UserPreferences';
import { SupportedLanguages } from '@homzhub/common/src/services/Localization/constants';
import {
  ILoginPayload,
  IRefreshTokenPayload,
  IUpdateUserPreferences,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IAuthCallback } from '@homzhub/common/src/modules/user/interface';
import { AuthenticationType, IAuthenticationEvent } from '@homzhub/common/src/services/Analytics/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

export function* login(action: IFluxStandardAction<ILoginPayload>) {
  if (!action.payload) return;
  const {
    payload: { data, callback, is_referral, is_from_signup, handleDynamicLink },
  } = action;
  const { EMAIL, OTP, REFERRAL } = AuthenticationType;

  let trackData: IAuthenticationEvent = {
    source: is_referral ? REFERRAL : data.action === LoginTypes.EMAIL ? EMAIL : OTP,
    ...(data.action === LoginTypes.EMAIL && { email: data.payload.email }),
    ...(data.action === LoginTypes.OTP && { phone_number: data.payload.phone_number }),
  };

  try {
    const userData: User = yield call(UserRepository.login, data);
    const tokens = { refresh_token: userData.refreshToken, access_token: userData.accessToken };
    console.log('🚀 ~ file: saga.ts ~ line 47 ~ function*login ~ userData', userData);
    yield put(UserActions.loginSuccess(tokens));
    yield StorageService.set<IUserTokens>(StorageKeys.USER, tokens);
    if (handleDynamicLink) {
      handleDynamicLink();
    }
    const handleCallback = (): void => {
      if (is_referral || is_from_signup) {
        AnalyticsService.track(EventType.SignupSuccess, { ...trackData, email: userData.email });
      } else {
        AnalyticsService.track(EventType.LoginSuccess, { ...trackData, email: userData.email });
      }
    };

    yield AnalyticsService.setUser(userData, handleCallback);

    if (callback) {
      callback();
    }
  }catch (e: any) {    const error = ErrorUtils.getErrorMessage(e.details);
    trackData = {
      ...trackData,
      error,
    };

    if (is_referral || is_from_signup) {
      yield AnalyticsService.track(EventType.SignupFailure, trackData);
    } else {
      yield AnalyticsService.track(EventType.LoginFailure, trackData);
    }

    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    yield put(UserActions.loginFailure(error));
  }
}

export function* deactivateUserAccount(action: IFluxStandardAction<IAuthCallback>) {
  const { payload } = action;
  try {
    const tokens: IUserTokens = yield StorageService.get(StorageKeys.USER);
    yield call(UserRepository.deactivateUserAccount, {
      refresh_token: tokens.refresh_token,
      device_id: DeviceUtils.getDeviceId(),
    } as IRefreshTokenPayload);
    yield put(UserActions.logoutSuccess());
    yield put(UserActions.clearFavouriteProperties());
    yield StorageService.remove(StorageKeys.USER);
    yield StorageService.remove(StorageKeys.DEVICE_TOKEN);
    if (payload?.callback) {
      payload.callback(true);
    }
  }catch (e: any) {    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    yield put(UserActions.logoutFailure(error));
    if (payload?.callback) {
      payload.callback(false);
    }
  }
}

export function* logout(action: IFluxStandardAction<IAuthCallback>) {
  const { payload } = action;
  try {
    const tokens: IUserTokens = yield StorageService.get(StorageKeys.USER);
    yield call(UserRepository.logout, {
      refresh_token: tokens.refresh_token,
      device_id: DeviceUtils.getDeviceId(),
    } as IRefreshTokenPayload);

    yield put(UserActions.logoutSuccess());
    yield put(SearchActions.setInitialState());
    yield put(UserActions.clearFavouriteProperties());
    yield StorageService.remove(StorageKeys.USER);
    yield StorageService.remove(StorageKeys.DEVICE_TOKEN);
    if (payload?.callback) {
      payload.callback(true);
    }
  }catch (e: any) {    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    yield put(UserActions.logoutFailure(error));
    if (payload?.callback) {
      payload.callback(false);
    }
  }
}

export function* userProfile() {
  try {
    const response = yield call(UserRepository.getUserProfile);
    yield put(UserActions.getUserProfileSuccess(response));
  }catch (e: any) {    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    yield put(UserActions.getUserProfileFailure());
  }
}

export function* userPreferences() {
  try {
    const response: UserPreferences = yield call(UserRepository.getUserPreferences);
    const { metricUnit } = response;
    yield put(UserActions.getUserPreferencesSuccess(response));
    const filters: IFilter = yield select(SearchSelector.getFilters);
    // adds the search radius unit filter
    yield put(
      SearchActions.setFilter({
        ...filters,
        miscellaneous: { ...filters.miscellaneous, search_radius_unit: metricUnit },
      } as IFilter)
    );

    const currentLanguage = yield I18nService.getLanguage();
    if (currentLanguage !== response.languageCode) {
      yield StorageService.set(StorageKeys.USER_SELECTED_LANGUAGE, response.languageCode);
      yield I18nService.changeLanguage(response.languageCode as SupportedLanguages);
    }
  }catch (e: any) {    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    yield put(UserActions.getUserPreferencesFailure());
  }
}

export function* updateUserPreferences(action: IFluxStandardAction<IUpdateUserPreferences>) {
  const { payload } = action;
  try {
    const response: UserPreferences = yield call(
      UserRepository.updateUserPreferences,
      payload as IUpdateUserPreferences
    );

    if (payload && UserPreferencesKeys.LanguageKey === Object.keys(payload)[0]) {
      yield StorageService.set(StorageKeys.USER_SELECTED_LANGUAGE, response.languageCode);
      yield I18nService.changeLanguage(response.languageCode as SupportedLanguages);
    }
    const { metricUnit } = response;
    const filters: IFilter = yield select(SearchSelector.getFilters);

    yield put(UserActions.getUserPreferencesSuccess(response));
    yield put(
      SearchActions.setFilter({
        ...filters,
        miscellaneous: { ...filters.miscellaneous, search_radius_unit: metricUnit },
      } as IFilter)
    );
  }catch (e: any) {    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    yield put(UserActions.getUserPreferencesFailure());
  }
}

export function* getUserAssets() {
  try {
    const response = yield call(AssetRepository.getPropertiesByStatus);
    yield put(UserActions.getAssetsSuccess(response));
  }catch (e: any) {    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    yield put(UserActions.getAssetsFailure());
  }
}

export function* getFavouriteProperties() {
  try {
    const response = yield call(UserRepository.getWishlistProperties);
    yield put(UserActions.getFavouritePropertiesSuccess(response));
  }catch (e: any) {    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    yield put(UserActions.getFavouritePropertiesFailure());
  }
}

export function* getUserSubscriptions() {
  try {
    const response = yield call(UserRepository.getUserSubscription);
    yield put(UserActions.getUserSubscriptionsSuccess(response));
  }catch (e: any) {    yield put(UserActions.getUserSubscriptionsFailure());
  }
}

export function* getUserServices() {
  try {
    const response = yield call(ServiceRepository.getUserServices);
    yield put(UserActions.getUserServicesSuccess(response));
  }catch (e: any) {    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    yield put(UserActions.getUserServicesFailure());
  }
}

export function* getUserTransaction() {
  try {
    const response = yield call(UserRepository.getCoinTransaction);
    yield put(UserActions.getUserCoinTransactionSuccess(response));
  }catch (e: any) {    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    yield put(UserActions.getUserCoinTransactionFailure());
  }
}

export function* getBankInfo(action: IFluxStandardAction<number>) {
  try {
    const response = yield call(UserRepository.getUserBankInfo, action.payload as number);
    yield put(UserActions.getBankInfoSuccess(response));
  }catch (e: any) {    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    yield put(UserActions.getBankInfoFailure());
  }
}

export function* watchUser() {
  yield takeEvery(UserActionTypes.AUTH.LOGIN, login);
  yield takeEvery(UserActionTypes.AUTH.LOGOUT, logout);
  yield takeEvery(UserActionTypes.AUTH.DEACTIVATE_USER_ACCOUNT, deactivateUserAccount);
  yield takeEvery(UserActionTypes.GET.USER_PROFILE, userProfile);
  yield takeEvery(UserActionTypes.GET.USER_PREFERENCES, userPreferences);
  yield takeEvery(UserActionTypes.UPDATE.USER_PREFERENCES, updateUserPreferences);
  yield takeEvery(UserActionTypes.GET.USER_ASSETS, getUserAssets);
  yield takeEvery(UserActionTypes.GET.FAVOURITE_PROPERTIES, getFavouriteProperties);
  yield takeEvery(UserActionTypes.GET.USER_SUBSCRIPTIONS, getUserSubscriptions);
  yield takeEvery(UserActionTypes.GET.USER_SERVICES, getUserServices);
  yield takeEvery(UserActionTypes.GET.USER_COIN_TRANSACTION, getUserTransaction);
  yield takeEvery(UserActionTypes.GET.BANK_INFO, getBankInfo);
}
