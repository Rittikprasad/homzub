/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { put, takeEvery, call, takeLatest } from '@redux-saga/core/effects';
import { select } from 'redux-saga/effects';
import { findIndex } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AssetActions, AssetActionTypes } from '@homzhub/common/src/modules/asset/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { AssetGallery } from '@homzhub/common/src/domain/models/AssetGallery';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { AssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { User } from '@homzhub/common/src/domain/models/User';
import {
  IAssetUserPayload,
  IAssetVisitPayload,
  IGetListingReviews,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction, VoidGenerator } from '@homzhub/common/src/modules/interfaces';
import { IGetAssetPayload, IGetDocumentPayload } from '@homzhub/common/src/modules/asset/interfaces';

function* getAssetReviews(action: IFluxStandardAction<IGetListingReviews>): VoidGenerator {
  try {
    const response = yield call(AssetRepository.getListingReviewsSummary, action.payload as IGetListingReviews);
    yield put(AssetActions.getAssetReviewsSuccess(response as AssetReview));
  } catch (err) {
    yield put(AssetActions.getAssetReviewsFailure(err.message));
  }
}

function* getAssetDetails(action: IFluxStandardAction<IGetAssetPayload>) {
  if (action.payload) {
    const { propertyTermId, onCallback } = action.payload;
    let response: Asset;
    let reviewParams;
    try {
      const { asset_transaction_type } = yield select(SearchSelector.getFilters);
      if (asset_transaction_type === 0) {
        // RENT FLOW
        response = yield call(AssetRepository.getLeaseListing, propertyTermId);
        reviewParams = { lease_listing: response.leaseTerm?.id };
      } else {
        // SALE FLOW
        response = yield call(AssetRepository.getSaleListing, propertyTermId);
        reviewParams = { sale_listing: response.saleTerm?.id };
      }

      yield put(AssetActions.getAssetSuccess(response));
      yield put(OfferActions.getListingDetailSuccess(response));
      yield put(AssetActions.getAssetReviews(reviewParams));

      if (onCallback) onCallback({ status: true });
    } catch (err) {
      if (onCallback) onCallback({ status: false });

      const error = ErrorUtils.getErrorMessage(err.details);
      AlertHelper.error({ message: error, statusCode: err.details.statusCode });

      yield put(AssetActions.getAssetFailure(err.message));
    }
  }
}

function* getAssetDocuments(action: IFluxStandardAction<IGetDocumentPayload>): VoidGenerator {
  if (action.payload) {
    const { assetId, onCallback } = action.payload;
    try {
      const response = yield call(AssetRepository.getAssetDocument, assetId);
      yield put(AssetActions.getAssetDocumentSuccess(response as AssetDocument[]));
      if (onCallback) {
        onCallback({ status: true });
      }
    } catch (err) {
      if (onCallback) {
        onCallback({ status: false });
      }
      const error = ErrorUtils.getErrorMessage(err.details);
      AlertHelper.error({ message: error, statusCode: err.details.statusCode });
      yield put(AssetActions.getAssetDocumentFailure(err.message));
    }
  }
}

function* getAssetVisit(action: IFluxStandardAction<IAssetVisitPayload>): VoidGenerator {
  try {
    const response = yield call(AssetRepository.getPropertyVisit, action.payload as IAssetVisitPayload);
    yield put(AssetActions.getAssetVisitSuccess(response as AssetVisit[]));
  } catch (err) {
    const error = ErrorUtils.getErrorMessage(err.details);
    AlertHelper.error({ message: error, statusCode: err.details.statusCode });
    yield put(AssetActions.getAssetVisitFailure(err.message));
  }
}

export function* getUserActiveAssets(): VoidGenerator {
  try {
    const response = yield call(AssetRepository.getActiveAssets);
    yield put(AssetActions.getActiveAssetsSuccess(response as Asset[]));
  } catch (e) {
    const error = ErrorUtils.getErrorMessage(e.details);
    AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    yield put(AssetActions.getActiveAssetsFailure());
  }
}

export function* getAssetById(action: IFluxStandardAction<number>) {
  try {
    const response: Asset = yield call(AssetRepository.getAssetById, action.payload as number);
    yield put(AssetActions.getAssetByIdSuccess(response));

    const existingCoverImageIndex = findIndex(response.attachments, (attachment: Attachment) => {
      return attachment.isCoverImage;
    });
    const assetImage = response.attachments.map((item, index) => {
      return {
        id: null,
        description: '',
        is_cover_image: existingCoverImageIndex === -1 && index === 0,
        asset: response.id,
        attachment: item.id,
        link: item.link,
        file_name: item.fileName,
        isLocalImage: false,
      };
    });

    yield put(RecordAssetActions.setSelectedImages(ObjectMapper.deserializeArray(AssetGallery, assetImage)));
  } catch (e) {
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    yield put(AssetActions.getAssetByIdFailure());
  }
}

function* getAssetUsers(action: IFluxStandardAction<IAssetUserPayload>): VoidGenerator {
  const { payload } = action;
  try {
    const response = yield call(AssetRepository.getAssetUsers, payload as IAssetUserPayload);
    yield put(AssetActions.getAssetUsersSuccess(response as User[]));
    if (payload && payload.onCallback) {
      payload.onCallback(true);
    }
  } catch (err) {
    const error = ErrorUtils.getErrorMessage(err.details);
    AlertHelper.error({ message: error, statusCode: err.details.statusCode });
    yield put(AssetActions.getAssetUsersFailure());
  }
}

export function* watchAsset() {
  yield takeEvery(AssetActionTypes.GET.ASSET, getAssetDetails);
  yield takeEvery(AssetActionTypes.GET.REVIEWS, getAssetReviews);
  yield takeEvery(AssetActionTypes.GET.ASSET_DOCUMENT, getAssetDocuments);
  yield takeLatest(AssetActionTypes.GET.ASSET_VISIT, getAssetVisit);
  yield takeEvery(AssetActionTypes.GET.USER_ACTIVE_ASSETS, getUserActiveAssets);
  yield takeEvery(AssetActionTypes.GET.ASSET_BY_ID, getAssetById);
  yield takeEvery(AssetActionTypes.GET.ASSET_USERS, getAssetUsers);
}
