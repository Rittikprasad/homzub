import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { IMessageKeyValue } from '@homzhub/common/src/domain/models/Message';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  ICurrentOffer,
  IOfferCompare,
  IExistingProposalsLease,
  IExistingProposalsSale,
  IOfferState,
  OfferFormValues,
} from '@homzhub/common/src/modules/offers/interfaces';

const getPastProposalsRent = (state: IState): IExistingProposalsLease | null => {
  const currentOffer = getCurrentOffer(state);
  const offerListing = getListingDetail(state);
  if (currentOffer) {
    const {
      rent,
      securityDeposit,
      minLockInPeriod,
      moveInDate,
      leasePeriod,
      annualRentIncrementPercentage,
      tenantPreferences,
    } = currentOffer;
    return {
      expectedPrice: `${rent}`,
      securityDeposit: `${securityDeposit}`,
      minimumLeasePeriod: minLockInPeriod,
      maximumLeasePeriod: leasePeriod,
      annualRentIncrementPercentage: annualRentIncrementPercentage ? `${annualRentIncrementPercentage}` : '',
      availableFromDate: `${moveInDate}`,
      maintenancePaidBy: `${offerListing?.leaseTerm?.maintenancePaidBy}`,
      utilityPaidBy: `${offerListing?.leaseTerm?.maintenancePaidBy}`,
      tenantPreferences: tenantPreferences.map((item) => ({ id: item.id, label: item.name, isSelected: true })),
      message: '',
    };
  }
  if (offerListing?.leaseTerm) {
    const {
      expectedPrice,
      securityDeposit,
      minimumLeasePeriod,
      maximumLeasePeriod,
      annualRentIncrementPercentage,
      availableFromDate,
      maintenancePaidBy,
      utilityPaidBy,
      tenantPreferences,
    } = offerListing.leaseTerm;
    return {
      expectedPrice: `${expectedPrice}`,
      securityDeposit: `${securityDeposit}`,
      minimumLeasePeriod,
      maximumLeasePeriod,
      annualRentIncrementPercentage: annualRentIncrementPercentage ? `${annualRentIncrementPercentage}` : '',
      availableFromDate,
      maintenancePaidBy,
      utilityPaidBy,
      tenantPreferences: tenantPreferences.map((item) => ({ id: item.id, label: item.name, isSelected: true })),
      message: '',
    };
  }
  return null;
};

const getPastProposalsSale = (state: IState): IExistingProposalsSale | null => {
  const currentOffer = getCurrentOffer(state);
  const offerListing = getListingDetail(state);

  if (currentOffer) {
    const { price, bookingAmount } = currentOffer;
    return {
      expectedPrice: `${price}`,
      expectedBookingAmount: `${bookingAmount}`,
      message: '',
    };
  }

  if (offerListing?.saleTerm) {
    const { expectedPrice, expectedBookingAmount } = offerListing.saleTerm;
    return {
      expectedPrice: `${expectedPrice}`,
      expectedBookingAmount: `${expectedBookingAmount}`,
      message: '',
    };
  }

  return null;
};

const getOfferPayload = (state: IState): ICurrentOffer | null => {
  const {
    offer: { currentOfferPayload },
  } = state;

  return currentOfferPayload;
};

const getOfferCompareData = (state: IState): IOfferCompare => {
  const {
    offer: { compareData },
  } = state;

  return compareData;
};

const getListingDetail = (state: IState): Asset | null => {
  const {
    offer: { listingDetail },
  } = state;
  if (!listingDetail) return null;
  return ObjectMapper.deserialize(Asset, listingDetail);
};

const getNegotiations = (state: IState): Offer[] => {
  const {
    offer: { negotiations },
  } = state;
  if (!negotiations.length) return [];
  return ObjectMapper.deserializeArray(Offer, negotiations);
};

// Taking boolean value as i/p to handle the possible future need with desired value.
const getFormattedTenantPreferences = (state: IState, value = true): ICheckboxGroupData[] => {
  const asset = getListingDetail(state);
  if (asset && asset.leaseTerm?.tenantPreferences) {
    return asset.leaseTerm?.tenantPreferences.map((item) => ({
      id: item.id,
      label: item.name,
      isSelected: value,
    }));
  }
  return [];
};

const getCurrentOffer = (state: IState): Offer | null => {
  const {
    offer: { currentOffer },
  } = state;

  return currentOffer;
};
const getOfferLoaders = (state: IState): IOfferState['loaders'] => {
  return state.offer.loaders;
};

const getOfferFormValues = (state: IState): OfferFormValues | null => {
  return state.offer.offerForm;
};

const getNegotiationComments = (state: IState): IMessageKeyValue | null => {
  return state.offer.negotiationComments;
};

export const OfferSelectors = {
  getPastProposalsRent,
  getPastProposalsSale,
  getListingDetail,
  getOfferPayload,
  getNegotiations,
  getOfferCompareData,
  getFormattedTenantPreferences,
  getCurrentOffer,
  getOfferLoaders,
  getOfferFormValues,
  getNegotiationComments,
};
