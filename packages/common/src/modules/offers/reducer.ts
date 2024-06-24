import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { OfferActionPayloadTypes, OfferActionTypes } from '@homzhub/common/src/modules/offers/actions';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IOffer, Offer } from '@homzhub/common/src/domain/models/Offer';
import { Message } from '@homzhub/common/src/domain/models/Message';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import {
  ICurrentOffer,
  IOfferCompare,
  OfferFormValues,
  IOfferState,
  IGetNegotiationComments,
} from '@homzhub/common/src/modules/offers/interfaces';

export const initialOfferState: IOfferState = {
  currentOfferPayload: null,
  currentOffer: null,
  negotiations: [],
  listingDetail: null,
  compareData: {},
  loaders: {
    negotiations: false,
    listingDetail: false,
    negotiationComments: false,
  },
  offerForm: null,
  negotiationComments: null,
};

export const offerReducer = (
  state: IOfferState = initialOfferState,
  action: IFluxStandardAction<OfferActionPayloadTypes>
): IOfferState => {
  switch (action.type) {
    case OfferActionTypes.GET.LISTING_DETAIL:
      return {
        ...state,
        ['listingDetail']: null,
        ['loaders']: { ...state.loaders, ['listingDetail']: true },
      };
    case OfferActionTypes.GET.LISTING_DETAIL_SUCCESS:
      return {
        ...state,
        ['listingDetail']: action.payload as IAsset,
        ['loaders']: { ...state.loaders, ['listingDetail']: false },
      };
    case OfferActionTypes.GET.LISTING_DETAIL_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['listingDetail']: false },
      };
    case OfferActionTypes.GET.NEGOTIATIONS:
      return {
        ...state,
        ['negotiations']: [],
        ['loaders']: { ...state.loaders, ['negotiations']: true },
      };
    case OfferActionTypes.GET.NEGOTIATIONS_SUCCESS:
      return {
        ...state,
        ['negotiations']: action.payload as IOffer[],
        ['loaders']: { ...state.loaders, ['negotiations']: false },
      };
    case OfferActionTypes.GET.NEGOTIATIONS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['negotiations']: false },
      };
    case OfferActionTypes.GET.NEGOTIATION_COMMENTS:
      // eslint-disable-next-line no-case-declarations
      const payload = action.payload as IGetNegotiationComments;
      return {
        ...state,
        ['negotiationComments']: !payload?.isNew ? null : state.negotiationComments,
        ['loaders']: { ...state.loaders, ['negotiationComments']: !payload?.isNew },
      };
    case OfferActionTypes.GET.NEGOTIATION_COMMENTS_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const messageResult = ReducerUtils.formatMessages(action.payload as Message[], null);
      return {
        ...state,
        ['negotiationComments']: messageResult,
        ['loaders']: { ...state.loaders, ['negotiationComments']: false },
      };
    case OfferActionTypes.GET.NEGOTIATION_COMMENTS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['negotiationComments']: false },
      };
    case OfferActionTypes.SET.CURRENT_OFFER_PAYLOAD:
      return {
        ...state,
        ['currentOfferPayload']: action.payload as ICurrentOffer,
      };
    case OfferActionTypes.SET.CURRENT_OFFER:
      return {
        ...state,
        ['currentOffer']: action.payload as Offer,
      };
    case OfferActionTypes.SET.COMPARE_OFFER_DATA:
      return {
        ...state,
        ['compareData']: action.payload as IOfferCompare,
      };
    case OfferActionTypes.CLEAR_CURRENT_OFFER:
      return {
        ...state,
        ['currentOffer']: null,
      };
    case OfferActionTypes.SET.OFFER_FORM_VALUES:
      return {
        ...state,
        ['offerForm']: action.payload as OfferFormValues,
      };
    case OfferActionTypes.CLEAR_OFFER_FORM_VALUES:
      return {
        ...state,
        ['offerForm']: null,
      };
    case OfferActionTypes.CLEAR_STATE:
      return initialOfferState;
    default:
      return {
        ...state,
      };
  }
};
