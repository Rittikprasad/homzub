import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IUserTokens } from '@homzhub/common/src/services/storage/StorageService';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { BankInfo, IBankInfo } from '@homzhub/common/src/domain/models/BankInfo';
import { CoinTransaction, ICoinTransaction } from '@homzhub/common/src/domain/models/CoinTransaction';
import { IUserProfile, UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { IUserPreferences, UserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';
import { IUserSubscription, UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';
import { IWishlist, Wishlist } from '@homzhub/common/src/domain/models/Wishlist';
import { IAuthCallback } from '@homzhub/common/src/modules/user/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ILoginPayload, IUpdateUserPreferences } from '@homzhub/common/src/domain/repositories/interfaces';

const actionTypePrefix = 'User/';

export const UserActionTypes = {
  AUTH: {
    LOGIN: `${actionTypePrefix}LOGIN`,
    LOGIN_SUCCESS: `${actionTypePrefix}LOGIN_SUCCESS`,
    LOGIN_FAILURE: `${actionTypePrefix}LOGIN_FAILURE`,
    LOGOUT: `${actionTypePrefix}LOGOUT`,
    LOGOUT_SUCCESS: `${actionTypePrefix}LOGOUT_SUCCESS`,
    LOGOUT_FAILURE: `${actionTypePrefix}LOGOUT_FAILURE`,
    DEACTIVATE_USER_ACCOUNT: `${actionTypePrefix}DEACTIVATE_USER_ACCOUNT`,
  },
  GET: {
    USER_PROFILE: `${actionTypePrefix}USER_PROFILE`,
    USER_PROFILE_SUCCESS: `${actionTypePrefix}USER_PROFILE_SUCCESS`,
    USER_PROFILE_FAILURE: `${actionTypePrefix}USER_PROFILE_FAILURE`,
    USER_PREFERENCES: `${actionTypePrefix}USER_PREFERENCES`,
    USER_PREFERENCES_SUCCESS: `${actionTypePrefix}USER_PREFERENCES_SUCCESS`,
    USER_PREFERENCES_FAILURE: `${actionTypePrefix}USER_PREFERENCES_FAILURE`,
    USER_ASSETS: `${actionTypePrefix}USER_ASSETS`,
    USER_ASSETS_SUCCESS: `${actionTypePrefix}USER_ASSETS_SUCCESS`,
    USER_ASSETS_FAILURE: `${actionTypePrefix}USER_ASSETS_FAILURE`,
    FAVOURITE_PROPERTIES: `${actionTypePrefix}FAVOURITE_PROPERTIES`,
    FAVOURITE_PROPERTIES_SUCCESS: `${actionTypePrefix}FAVOURITE_PROPERTIES_SUCCESS`,
    FAVOURITE_PROPERTIES_FAILURE: `${actionTypePrefix}FAVOURITE_PROPERTIES_FAILURE`,
    USER_SUBSCRIPTIONS: `${actionTypePrefix}USER_SUBSCRIPTIONS`,
    USER_SUBSCRIPTIONS_SUCCESS: `${actionTypePrefix}USER_SUBSCRIPTIONS_SUCCESS`,
    USER_SUBSCRIPTIONS_FAILURE: `${actionTypePrefix}USER_SUBSCRIPTIONS_FAILURE`,
    USER_SERVICES: `${actionTypePrefix}USER_SERVICES`,
    USER_SERVICES_SUCCESS: `${actionTypePrefix}USER_SERVICES_SUCCESS`,
    USER_SERVICES_FAILURE: `${actionTypePrefix}USER_SERVICES_FAILURE`,
    USER_COIN_TRANSACTION: `${actionTypePrefix}USER_COIN_TRANSACTION`,
    USER_COIN_TRANSACTION_SUCCESS: `${actionTypePrefix}USER_COIN_TRANSACTION_SUCCESS`,
    USER_COIN_TRANSACTION_FAILURE: `${actionTypePrefix}USER_COIN_TRANSACTION_FAILURE`,
    BANK_INFO: `${actionTypePrefix}BANK_INFO`,
    BANK_INFO_SUCCESS: `${actionTypePrefix}BANK_INFO_SUCCESS`,
    BANK_INFO_FAILURE: `${actionTypePrefix}BANK_INFO_FAILURE`,
  },
  SET: {
    CHANGE_STACK: `${actionTypePrefix}CHANGE_STACK`,
    IS_ADD_PROPERTY_FLOW: `${actionTypePrefix}IS_ADD_PROPERTY_FLOW`,
    CLEAR_FAVOURITE_PROPERTIES: `${actionTypePrefix}CLEAR_FAVOURITE_PROPERTIES`,
    USER_COUNTRY_CODE: `${actionTypePrefix}USER_COUNTRY_CODE`,
    CURRENT_BANK_ACCOUNT_ID: `${actionTypePrefix}CURRENT_BANK_ACCOUNT_ID`,
  },
  UPDATE: {
    ONBOARDING: `${actionTypePrefix}UPDATE_ONBOARDING`,
    USER_PREFERENCES: `${actionTypePrefix}UPDATE_USER_PREFERENCES`,
  },
};

const login = (payload: ILoginPayload): IFluxStandardAction<ILoginPayload> => {
  return {
    type: UserActionTypes.AUTH.LOGIN,
    payload,
  };
};

const loginSuccess = (data: IUserTokens): IFluxStandardAction<IUserTokens> => {
  return {
    type: UserActionTypes.AUTH.LOGIN_SUCCESS,
    payload: data,
  };
};

const loginFailure = (error: string): IFluxStandardAction => {
  return {
    type: UserActionTypes.AUTH.LOGIN_FAILURE,
    error,
  };
};

const logout = (payload?: IAuthCallback): IFluxStandardAction<IAuthCallback> => {
  return {
    type: UserActionTypes.AUTH.LOGOUT,
    payload,
  };
};

const deactivateUserAccount = (payload?: IAuthCallback): IFluxStandardAction<IAuthCallback> => {
  return {
    type: UserActionTypes.AUTH.DEACTIVATE_USER_ACCOUNT,
    payload,
  };
};

const logoutSuccess = (): IFluxStandardAction => {
  return {
    type: UserActionTypes.AUTH.LOGOUT_SUCCESS,
  };
};

const logoutFailure = (error: string): IFluxStandardAction => {
  return {
    type: UserActionTypes.AUTH.LOGOUT_FAILURE,
    error,
  };
};

const updateOnBoarding = (updatedOnBoarding: boolean): IFluxStandardAction<boolean> => ({
  type: UserActionTypes.UPDATE.ONBOARDING,
  payload: updatedOnBoarding,
});

const setChangeStack = (payload: boolean): IFluxStandardAction<boolean> => ({
  type: UserActionTypes.SET.CHANGE_STACK,
  payload,
});

const setUserCountryCode = (payload: number): IFluxStandardAction<number> => ({
  type: UserActionTypes.SET.USER_COUNTRY_CODE,
  payload,
});

const getUserProfile = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_PROFILE,
});

const getUserProfileSuccess = (payload: UserProfile): IFluxStandardAction<IUserProfile> => ({
  type: UserActionTypes.GET.USER_PROFILE_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getUserProfileFailure = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_PROFILE_FAILURE,
});

const getUserPreferences = (): IFluxStandardAction => {
  return {
    type: UserActionTypes.GET.USER_PREFERENCES,
  };
};

const getUserPreferencesSuccess = (payload: UserPreferences): IFluxStandardAction<IUserPreferences> => {
  return {
    type: UserActionTypes.GET.USER_PREFERENCES_SUCCESS,
    payload: ObjectMapper.serialize(payload),
  };
};

const getUserPreferencesFailure = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_PREFERENCES_FAILURE,
});

const setAddPropertyFlow = (payload: boolean): IFluxStandardAction<boolean> => ({
  type: UserActionTypes.SET.IS_ADD_PROPERTY_FLOW,
  payload,
});

const updateUserPreferences = (payload: IUpdateUserPreferences): IFluxStandardAction<IUpdateUserPreferences> => ({
  type: UserActionTypes.UPDATE.USER_PREFERENCES,
  payload,
});

const getAssets = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_ASSETS,
});

const getAssetsSuccess = (payload: Asset[]): IFluxStandardAction<IAsset[]> => ({
  type: UserActionTypes.GET.USER_ASSETS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getAssetsFailure = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_ASSETS_FAILURE,
});

const getFavouriteProperties = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.FAVOURITE_PROPERTIES,
});

const getFavouritePropertiesSuccess = (data: Wishlist[]): IFluxStandardAction<Asset[]> => ({
  type: UserActionTypes.GET.FAVOURITE_PROPERTIES_SUCCESS,
  payload: ObjectMapper.serializeArray(data),
});

const getFavouritePropertiesFailure = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.FAVOURITE_PROPERTIES_FAILURE,
});

const clearFavouriteProperties = (): IFluxStandardAction => ({
  type: UserActionTypes.SET.CLEAR_FAVOURITE_PROPERTIES,
});

const getUserSubscriptions = (): IFluxStandardAction => {
  return {
    type: UserActionTypes.GET.USER_SUBSCRIPTIONS,
  };
};

const getUserSubscriptionsSuccess = (payload: UserSubscription): IFluxStandardAction<IUserSubscription> => {
  return {
    type: UserActionTypes.GET.USER_SUBSCRIPTIONS_SUCCESS,
    payload: ObjectMapper.serialize(payload),
  };
};

const getUserSubscriptionsFailure = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_SUBSCRIPTIONS_FAILURE,
});

const getUserServices = (): IFluxStandardAction => {
  return {
    type: UserActionTypes.GET.USER_SERVICES,
  };
};

const getUserServicesSuccess = (payload: Asset[]): IFluxStandardAction<IAsset[]> => {
  return {
    type: UserActionTypes.GET.USER_SERVICES_SUCCESS,
    payload: ObjectMapper.serializeArray(payload),
  };
};

const getUserServicesFailure = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_SERVICES_FAILURE,
});

const getUserCoinTransaction = (): IFluxStandardAction => {
  return {
    type: UserActionTypes.GET.USER_COIN_TRANSACTION,
  };
};

const getUserCoinTransactionSuccess = (payload: CoinTransaction[]): IFluxStandardAction<ICoinTransaction[]> => {
  return {
    type: UserActionTypes.GET.USER_COIN_TRANSACTION_SUCCESS,
    payload: ObjectMapper.serializeArray(payload),
  };
};

const getUserCoinTransactionFailure = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.USER_COIN_TRANSACTION_FAILURE,
});

const getBankInfo = (userId: number): IFluxStandardAction<number> => {
  return {
    type: UserActionTypes.GET.BANK_INFO,
    payload: userId,
  };
};

const getBankInfoSuccess = (payload: BankInfo[]): IFluxStandardAction<IBankInfo[]> => {
  return {
    type: UserActionTypes.GET.BANK_INFO_SUCCESS,
    payload: ObjectMapper.serializeArray(payload),
  };
};

const getBankInfoFailure = (): IFluxStandardAction => ({
  type: UserActionTypes.GET.BANK_INFO_FAILURE,
});

const setCurrentBankAccountId = (payload: number): IFluxStandardAction<number> => ({
  type: UserActionTypes.SET.CURRENT_BANK_ACCOUNT_ID,
  payload,
});

export type UserPayloadTypes =
  | string
  | boolean
  | number
  | IUserTokens
  | IUserProfile
  | IUserPreferences
  | IUserSubscription
  | IAsset[]
  | IWishlist[]
  | ICoinTransaction[]
  | IBankInfo[];

export const UserActions = {
  login,
  loginSuccess,
  loginFailure,
  logout,
  deactivateUserAccount,
  logoutSuccess,
  logoutFailure,
  updateOnBoarding,
  setChangeStack,
  setUserCountryCode,
  getUserProfile,
  getUserProfileSuccess,
  getUserProfileFailure,
  setAddPropertyFlow,
  getUserPreferences,
  getUserPreferencesSuccess,
  getUserPreferencesFailure,
  updateUserPreferences,
  getAssets,
  getAssetsSuccess,
  getAssetsFailure,
  getFavouriteProperties,
  getFavouritePropertiesSuccess,
  getFavouritePropertiesFailure,
  clearFavouriteProperties,
  getUserSubscriptions,
  getUserSubscriptionsSuccess,
  getUserSubscriptionsFailure,
  getUserServices,
  getUserServicesSuccess,
  getUserServicesFailure,
  getUserCoinTransaction,
  getUserCoinTransactionSuccess,
  getUserCoinTransactionFailure,
  getBankInfo,
  getBankInfoSuccess,
  getBankInfoFailure,
  setCurrentBankAccountId,
};
