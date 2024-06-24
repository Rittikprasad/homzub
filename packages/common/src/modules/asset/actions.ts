import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IGetAssetPayload, IGetDocumentPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { AssetReview, IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { AssetVisit, IAssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';
import { IUser, User } from '@homzhub/common/src/domain/models/User';
import {
  IAssetUserPayload,
  IAssetVisitPayload,
  IGetListingReviews,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

const actionTypePrefix = 'Asset/';

export const AssetActionTypes = {
  GET: {
    ASSET: `${actionTypePrefix}ASSET`,
    ASSET_SUCCESS: `${actionTypePrefix}ASSET_SUCCESS`,
    ASSET_FAILURE: `${actionTypePrefix}ASSET_FAILURE`,
    REVIEWS: `${actionTypePrefix}REVIEW`,
    REVIEWS_SUCCESS: `${actionTypePrefix}REVIEW_SUCCESS`,
    REVIEWS_FAILURE: `${actionTypePrefix}REVIEW_FAILURE`,
    ASSET_DOCUMENT: `${actionTypePrefix}ASSET_DOCUMENT`,
    ASSET_DOCUMENT_SUCCESS: `${actionTypePrefix}ASSET_DOCUMENT_SUCCESS`,
    ASSET_DOCUMENT_FAILURE: `${actionTypePrefix}ASSET_DOCUMENT_FAILURE`,
    ASSET_VISIT: `${actionTypePrefix}ASSET_VISIT`,
    ASSET_VISIT_SUCCESS: `${actionTypePrefix}ASSET_VISIT_SUCCESS`,
    ASSET_VISIT_FAILURE: `${actionTypePrefix}ASSET_VISIT_FAILURE`,
    USER_ACTIVE_ASSETS: `${actionTypePrefix}USER_ACTIVE_ASSETS`,
    USER_ACTIVE_ASSETS_SUCCESS: `${actionTypePrefix}USER_ACTIVE_ASSETS_SUCCESS`,
    USER_ACTIVE_ASSETS_FAILURE: `${actionTypePrefix}USER_ACTIVE_ASSETS_FAILURE`,
    ASSET_BY_ID: `${actionTypePrefix}ASSET_BY_ID`,
    ASSET_BY_ID_SUCCESS: `${actionTypePrefix}ASSET_BY_ID_SUCCESS`,
    ASSET_BY_ID_FAILURE: `${actionTypePrefix}ASSET_BY_ID_FAILURE`,
    ASSET_USERS: `${actionTypePrefix}ASSET_USERS`,
    ASSET_USERS_SUCCESS: `${actionTypePrefix}ASSET_USERS_SUCCESS`,
    ASSET_USERS_FAILURE: `${actionTypePrefix}ASSET_USERS_FAILURE`,
  },
  SET: {
    VISIT_IDS: `${actionTypePrefix}VISIT_IDS`,
    VISIT_TYPE: `${actionTypePrefix}VISIT_TYPE`,
  },
  CLEAR_ASSET: `${actionTypePrefix}CLEAR_ASSET`,
  CLEAR_VISITS: `${actionTypePrefix}CLEAR_VISITS`,
};

const getAssetReviews = (payload: IGetListingReviews): IFluxStandardAction<IGetListingReviews> => ({
  type: AssetActionTypes.GET.REVIEWS,
  payload,
});

const getAssetReviewsSuccess = (payload: AssetReview): IFluxStandardAction<IAssetReview> => ({
  type: AssetActionTypes.GET.REVIEWS_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getAssetReviewsFailure = (error: string): IFluxStandardAction => ({
  type: AssetActionTypes.GET.REVIEWS_FAILURE,
  error,
});

const getAsset = (payload: IGetAssetPayload): IFluxStandardAction<IGetAssetPayload> => ({
  type: AssetActionTypes.GET.ASSET,
  payload,
});

const getAssetSuccess = (asset: Asset): IFluxStandardAction<IAsset> => ({
  type: AssetActionTypes.GET.ASSET_SUCCESS,
  payload: ObjectMapper.serialize(asset),
});

const getAssetFailure = (error: string): IFluxStandardAction => ({
  type: AssetActionTypes.GET.ASSET_FAILURE,
  error,
});

const clearAsset = (): IFluxStandardAction => ({
  type: AssetActionTypes.CLEAR_ASSET,
});

const getAssetDocument = (payload: IGetDocumentPayload): IFluxStandardAction<IGetDocumentPayload> => ({
  type: AssetActionTypes.GET.ASSET_DOCUMENT,
  payload,
});

const getAssetDocumentSuccess = (data: AssetDocument[]): IFluxStandardAction<AssetDocument[]> => ({
  type: AssetActionTypes.GET.ASSET_DOCUMENT_SUCCESS,
  payload: data,
});

const getAssetDocumentFailure = (error: string): IFluxStandardAction<string> => ({
  type: AssetActionTypes.GET.ASSET_DOCUMENT_FAILURE,
  error,
});

const getAssetVisit = (payload: IAssetVisitPayload): IFluxStandardAction<IAssetVisitPayload> => ({
  type: AssetActionTypes.GET.ASSET_VISIT,
  payload,
});

const getAssetVisitSuccess = (payload: AssetVisit[]): IFluxStandardAction<IAssetVisit[]> => ({
  type: AssetActionTypes.GET.ASSET_VISIT_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getAssetVisitFailure = (error: string): IFluxStandardAction<string> => ({
  type: AssetActionTypes.GET.ASSET_VISIT_FAILURE,
  error,
});

const setVisitIds = (payload: number[]): IFluxStandardAction<number[]> => ({
  type: AssetActionTypes.SET.VISIT_IDS,
  payload,
});

const setVisitType = (payload: Tabs): IFluxStandardAction<Tabs> => ({
  type: AssetActionTypes.SET.VISIT_TYPE,
  payload,
});

const clearVisits = (): IFluxStandardAction => ({
  type: AssetActionTypes.CLEAR_VISITS,
});

const getActiveAssets = (): IFluxStandardAction => ({
  type: AssetActionTypes.GET.USER_ACTIVE_ASSETS,
});

const getActiveAssetsSuccess = (payload: Asset[]): IFluxStandardAction<IAsset[]> => ({
  type: AssetActionTypes.GET.USER_ACTIVE_ASSETS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getActiveAssetsFailure = (): IFluxStandardAction => ({
  type: AssetActionTypes.GET.USER_ACTIVE_ASSETS_FAILURE,
});

const getAssetById = (payload: number): IFluxStandardAction<number> => ({
  type: AssetActionTypes.GET.ASSET_BY_ID,
  payload,
});

const getAssetByIdSuccess = (payload: Asset): IFluxStandardAction<IAsset> => ({
  type: AssetActionTypes.GET.ASSET_BY_ID_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getAssetByIdFailure = (): IFluxStandardAction => ({
  type: AssetActionTypes.GET.ASSET_BY_ID_FAILURE,
});

const getAssetUsers = (payload: IAssetUserPayload): IFluxStandardAction<IAssetUserPayload> => ({
  type: AssetActionTypes.GET.ASSET_USERS,
  payload,
});

const getAssetUsersSuccess = (payload: User[]): IFluxStandardAction<IUser[]> => ({
  type: AssetActionTypes.GET.ASSET_USERS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getAssetUsersFailure = (): IFluxStandardAction => ({
  type: AssetActionTypes.GET.ASSET_USERS_FAILURE,
});

export type AssetPayloadTypes =
  | number
  | IAssetReview
  | IAsset
  | IAssetVisit[]
  | number[]
  | Tabs
  | IAsset[]
  | IAssetUserPayload
  | IUser[];

export const AssetActions = {
  clearAsset,
  getAssetReviews,
  getAssetReviewsSuccess,
  getAssetReviewsFailure,
  getAsset,
  getAssetSuccess,
  getAssetFailure,
  getAssetDocument,
  getAssetDocumentSuccess,
  getAssetDocumentFailure,
  getAssetVisit,
  getAssetVisitSuccess,
  getAssetVisitFailure,
  setVisitIds,
  setVisitType,
  clearVisits,
  getActiveAssets,
  getActiveAssetsSuccess,
  getAssetById,
  getAssetByIdSuccess,
  getAssetByIdFailure,
  getActiveAssetsFailure,
  getAssetUsers,
  getAssetUsersSuccess,
  getAssetUsersFailure,
};
