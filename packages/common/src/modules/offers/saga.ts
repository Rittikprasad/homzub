/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { call, put, select, takeLatest } from '@redux-saga/core/effects';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions, OfferActionTypes } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Message } from '@homzhub/common/src/domain/models/Message';
import { IFluxStandardAction, VoidGenerator } from '@homzhub/common/src/modules/interfaces';
import { INegotiation, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer } from '@homzhub/common/src/modules/offers/interfaces';

export function* getListingDetail(action: IFluxStandardAction<ICurrentOffer>) {
  if (!action.payload) return;
  const { type, listingId } = action.payload;
  let response: Asset;
  try {
    if (type === ListingType.LEASE_LISTING) {
      response = yield call(AssetRepository.getLeaseListing, listingId);
      if (response.leaseTerm) {
        const { expectedPrice, securityDeposit, annualRentIncrementPercentage } = response.leaseTerm;
        yield put(
          OfferActions.setCompareDetail({
            rent: expectedPrice,
            deposit: securityDeposit,
            incrementPercentage: annualRentIncrementPercentage ?? 0,
          })
        );
      }
    } else {
      response = yield call(AssetRepository.getSaleListing, listingId);
      if (response.saleTerm) {
        const { expectedPrice, expectedBookingAmount } = response.saleTerm;
        yield put(
          OfferActions.setCompareDetail({
            price: Number(expectedPrice),
            bookingAmount: Number(expectedBookingAmount),
          })
        );
      }
    }
    yield put(OfferActions.getListingDetailSuccess(response));
  }catch (e: any) {    yield put(OfferActions.getListingDetailFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getNegotiations(action: IFluxStandardAction<INegotiation>) {
  if (!action.payload) return;
  try {
    const response = yield call(OffersRepository.getNegotiations, action.payload);
    yield put(OfferActions.getNegotiationsSuccess(response));
  }catch (e: any) {    yield put(OfferActions.getNegotiationsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* getNegotiationComments(): VoidGenerator {
  try {
    const currentOfferPayload = yield select(OfferSelectors.getOfferPayload);
    const response = yield call(OffersRepository.getNegotiationComments, currentOfferPayload as ICurrentOffer);
    yield put(OfferActions.getNegotiationCommentsSucess(response as Message[]));
  }catch (e: any) {    yield put(OfferActions.getNegotiationCommentsFailure());
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
  }
}

export function* watchOffer() {
  yield takeLatest(OfferActionTypes.GET.LISTING_DETAIL, getListingDetail);
  yield takeLatest(OfferActionTypes.GET.NEGOTIATIONS, getNegotiations);
  yield takeLatest(OfferActionTypes.GET.NEGOTIATION_COMMENTS, getNegotiationComments);
}
