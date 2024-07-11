import { IUserTokens } from "@homzhub/common/src/services/storage/StorageService";
import {
  UserActionTypes,
  UserPayloadTypes,
} from "@homzhub/common/src/modules/user/actions";
import { IAsset } from "@homzhub/common/src/domain/models/Asset";
import { IBankInfo } from "@homzhub/common/src/domain/models/BankInfo";
import { ICoinTransaction } from "@homzhub/common/src/domain/models/CoinTransaction";
import { IUserProfile } from "@homzhub/common/src/domain/models/UserProfile";
import { IUserPreferences } from "@homzhub/common/src/domain/models/UserPreferences";
import { IUserSubscription } from "@homzhub/common/src/domain/models/UserSubscription";
import { IFluxStandardAction } from "@homzhub/common/src/modules/interfaces";
import { IUserState } from "@homzhub/common/src/modules/user/interface";

export const initialUserState: IUserState = {
  tokens: null,
  userProfile: null,
  userPreferences: null,
  userSubscriptions: null,
  isOnBoardingCompleted: false,
  isChangeStack: true,
  isAddPropertyFlow: false,
  userCountryCode: 0,
  assets: [],
  favouriteProperties: [],
  userServices: [],
  userTransaction: [],
  bankInfo: [],
  currentBankAccountId: -1,
  error: {
    user: "",
  },
  loaders: {
    user: false,
    userProfile: false,
    userPreferences: false,
    userSubscriptions: false,
    whileAssets: false,
    whileFavouriteProperties: false,
    userService: false,
    userTransaction: false,
    bankInfo: false,
  },
};

export const userReducer = (
  state: IUserState = initialUserState,
  action: IFluxStandardAction<UserPayloadTypes>
): IUserState => {
  switch (action.type) {
    case UserActionTypes.AUTH.LOGOUT:
    case UserActionTypes.AUTH.DEACTIVATE_USER_ACCOUNT:
    case UserActionTypes.AUTH.LOGIN:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["user"]: true },
        ["error"]: { ...state.error, ["user"]: "" },
      };
    case UserActionTypes.AUTH.LOGIN_SUCCESS:
      return {
        ...state,
        ["tokens"]: action.payload as IUserTokens,
        ["loaders"]: { ...state.loaders, ["user"]: false },
      };
    case UserActionTypes.AUTH.LOGOUT_SUCCESS:
    case UserActionTypes.AUTH.DEACTIVATE_USER_ACCOUNT:
      return {
        ...state,
        ["tokens"]: null,
        ["userProfile"]: null,
        ["userPreferences"]: null,
        ["loaders"]: { ...state.loaders, ["user"]: false },
      };
    case UserActionTypes.AUTH.LOGOUT_FAILURE:
    case UserActionTypes.AUTH.LOGIN_FAILURE:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["user"]: false },
        ["error"]: { ...state.error, ["user"]: action.error as string },
      };
    case UserActionTypes.UPDATE.ONBOARDING:
      return {
        ...state,
        ["isOnBoardingCompleted"]: action.payload as boolean,
      };
    case UserActionTypes.SET.CHANGE_STACK:
      return { ...state, ["isChangeStack"]: action.payload as boolean };
    case UserActionTypes.SET.USER_COUNTRY_CODE:
      return { ...state, ["userCountryCode"]: action.payload as number };
    case UserActionTypes.GET.USER_PROFILE:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userProfile"]: true },
      };
    case UserActionTypes.GET.USER_PROFILE_SUCCESS:
      return {
        ...state,
        ["userProfile"]: action.payload as IUserProfile,
        ["loaders"]: {
          ...state.loaders,
          ["userProfile"]: false,
        },
      };
    case UserActionTypes.GET.USER_PROFILE_FAILURE:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userProfile"]: false },
      };
    case UserActionTypes.SET.IS_ADD_PROPERTY_FLOW:
      return { ...state, ["isAddPropertyFlow"]: action.payload as boolean };
    case UserActionTypes.UPDATE.USER_PREFERENCES:
    case UserActionTypes.GET.USER_PREFERENCES:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userPreferences"]: true },
      };
    case UserActionTypes.GET.USER_PREFERENCES_SUCCESS:
      return {
        ...state,
        ["userPreferences"]: action.payload as IUserPreferences,
        ["loaders"]: {
          ...state.loaders,
          ["userPreferences"]: false,
        },
      };
    case UserActionTypes.GET.USER_PREFERENCES_FAILURE:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userPreferences"]: false },
      };
    case UserActionTypes.GET.USER_ASSETS_SUCCESS:
      return {
        ...state,
        assets: action.payload as IAsset[],
      };
    case UserActionTypes.GET.FAVOURITE_PROPERTIES:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["user"]: true },
      };
    case UserActionTypes.GET.FAVOURITE_PROPERTIES_SUCCESS:
      return {
        ...state,
        ["favouriteProperties"]: action.payload as IAsset[],
        ["loaders"]: {
          ...state.loaders,
          ["user"]: false,
        },
      };
    case UserActionTypes.SET.CLEAR_FAVOURITE_PROPERTIES:
      return {
        ...state,
        ["favouriteProperties"]: [],
      };
    case UserActionTypes.GET.USER_SUBSCRIPTIONS:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userSubscriptions"]: true },
      };
    case UserActionTypes.GET.USER_SUBSCRIPTIONS_SUCCESS:
      return {
        ...state,
        ["userSubscriptions"]: action.payload as IUserSubscription,
        ["loaders"]: {
          ...state.loaders,
          ["userSubscriptions"]: false,
        },
      };
    case UserActionTypes.GET.USER_SUBSCRIPTIONS_FAILURE:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userSubscriptions"]: false },
      };
    case UserActionTypes.GET.USER_SERVICES:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userService"]: true },
      };
    case UserActionTypes.GET.USER_SERVICES_SUCCESS:
      return {
        ...state,
        ["userServices"]: action.payload as IAsset[],
        ["loaders"]: {
          ...state.loaders,
          ["userService"]: false,
        },
      };
    case UserActionTypes.GET.USER_SERVICES_FAILURE:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userService"]: false },
      };
    case UserActionTypes.GET.USER_COIN_TRANSACTION:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userTransaction"]: true },
      };
    case UserActionTypes.GET.USER_COIN_TRANSACTION_SUCCESS:
      return {
        ...state,
        ["userTransaction"]: action.payload as ICoinTransaction[],
        ["loaders"]: {
          ...state.loaders,
          ["userTransaction"]: false,
        },
      };
    case UserActionTypes.GET.USER_COIN_TRANSACTION_FAILURE:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["userTransaction"]: false },
      };
    case UserActionTypes.GET.BANK_INFO:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["bankInfo"]: true },
      };
    case UserActionTypes.GET.BANK_INFO_SUCCESS:
      return {
        ...state,
        ["bankInfo"]: action.payload as IBankInfo[],
        ["loaders"]: {
          ...state.loaders,
          ["bankInfo"]: false,
        },
      };
    case UserActionTypes.GET.BANK_INFO_FAILURE:
      return {
        ...state,
        ["loaders"]: { ...state.loaders, ["bankInfo"]: false },
      };
    case UserActionTypes.SET.CURRENT_BANK_ACCOUNT_ID:
      return {
        ...state,
        ["currentBankAccountId"]: action.payload as number,
      };
    default:
      return state;
  }
};
