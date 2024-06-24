import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';
import { AssetActionTypes, AssetPayloadTypes } from '@homzhub/common/src/modules/asset/actions';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { IAssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

export const initialAssetState: IAssetState = {
  error: {
    reviews: '',
    asset: '',
    documents: '',
    visits: '',
  },
  loaders: {
    reviews: false,
    asset: false,
    documents: false,
    visits: false,
    activeAssets: false,
    assetById: false,
    assetUser: false,
  },
  asset: null,
  reviews: null,
  documents: [],
  visits: [],
  visitIds: [],
  visitType: Tabs.UPCOMING,
  activeAssets: [],
  assetById: null,
  assetUsers: [],
};

export const assetReducer = (
  state: IAssetState = initialAssetState,
  action: IFluxStandardAction<AssetPayloadTypes>
): IAssetState => {
  switch (action.type) {
    case AssetActionTypes.GET.REVIEWS:
      return {
        ...state,
        ['reviews']: null,
        ['loaders']: { ...state.loaders, ['reviews']: true },
        ['error']: { ...state.error, ['reviews']: '' },
      };
    case AssetActionTypes.GET.REVIEWS_SUCCESS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reviews']: false },
        ['reviews']: action.payload as IAssetReview,
      };
    case AssetActionTypes.GET.REVIEWS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reviews']: false },
        ['error']: { ...state.error, ['reviews']: action.error as string },
      };
    case AssetActionTypes.GET.ASSET:
      return {
        ...state,
        asset: null,
        ['loaders']: { ...state.loaders, ['asset']: true },
        ['error']: { ...state.error, ['asset']: '' },
      };
    case AssetActionTypes.GET.ASSET_SUCCESS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['asset']: false },
        ['asset']: action.payload as IAsset,
      };
    case AssetActionTypes.GET.ASSET_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['asset']: false },
        ['error']: { ...state.error, ['asset']: action.error as string },
      };
    case AssetActionTypes.GET.ASSET_DOCUMENT:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['documents']: true },
        ['error']: { ...state.error, ['documents']: '' },
      };
    case AssetActionTypes.GET.ASSET_DOCUMENT_SUCCESS:
      return {
        ...state,
        ['documents']: action.payload as any,
        ['loaders']: { ...state.loaders, ['documents']: false },
        ['error']: { ...state.error, ['documents']: '' },
      };
    case AssetActionTypes.GET.ASSET_DOCUMENT_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['documents']: false },
        ['error']: { ...state.error, ['documents']: action.error as string },
      };
    case AssetActionTypes.GET.ASSET_VISIT:
      return {
        ...state,
        ['visits']: initialAssetState.visits,
        ['loaders']: { ...state.loaders, ['visits']: true },
        ['error']: { ...state.error, ['visits']: '' },
      };
    case AssetActionTypes.GET.ASSET_VISIT_SUCCESS:
      return {
        ...state,
        ['visits']: action.payload as IAssetVisit[],
        ['loaders']: { ...state.loaders, ['visits']: false },
        ['error']: { ...state.error, ['visits']: '' },
      };
    case AssetActionTypes.GET.ASSET_VISIT_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visits']: false },
        ['error']: { ...state.error, ['visits']: action.error as string },
      };
    case AssetActionTypes.GET.USER_ACTIVE_ASSETS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['activeAssets']: true },
      };
    case AssetActionTypes.GET.USER_ACTIVE_ASSETS_SUCCESS:
      return {
        ...state,
        ['activeAssets']: action.payload as IAsset[],
        ['loaders']: { ...state.loaders, ['activeAssets']: false },
      };
    case AssetActionTypes.GET.USER_ACTIVE_ASSETS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['activeAssets']: false },
      };
    case AssetActionTypes.GET.ASSET_BY_ID:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetById']: true },
      };
    case AssetActionTypes.GET.ASSET_BY_ID_SUCCESS:
      return {
        ...state,
        ['assetById']: action.payload as IAsset,
        ['loaders']: { ...state.loaders, ['assetById']: false },
      };
    case AssetActionTypes.GET.ASSET_BY_ID_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetById']: false },
      };
    case AssetActionTypes.SET.VISIT_IDS:
      return { ...state, ['visitIds']: action.payload as number[] };
    case AssetActionTypes.SET.VISIT_TYPE:
      return { ...state, ['visitType']: action.payload as Tabs };
    case AssetActionTypes.CLEAR_VISITS:
      return { ...state, ['visits']: initialAssetState.visits };
    case AssetActionTypes.GET.ASSET_USERS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetUser']: true },
      };
    case AssetActionTypes.GET.ASSET_USERS_SUCCESS:
      return {
        ...state,
        ['assetUsers']: action.payload as IUser[],
        ['loaders']: { ...state.loaders, ['assetUser']: false },
      };
    case AssetActionTypes.GET.ASSET_USERS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetUser']: false },
      };
    case AssetActionTypes.CLEAR_ASSET:
      return initialAssetState;
    default:
      return state;
  }
};
