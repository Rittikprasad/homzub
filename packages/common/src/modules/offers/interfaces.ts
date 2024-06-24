import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IOffer, Offer } from '@homzhub/common/src/domain/models/Offer';
import { IMessageKeyValue } from '@homzhub/common/src/domain/models/Message';
import { ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';

export interface IOfferState {
  currentOfferPayload: ICurrentOffer | null;
  negotiations: IOffer[];
  currentOffer: Offer | null;
  listingDetail: IAsset | null;
  compareData: IOfferCompare;
  loaders: {
    negotiations: boolean;
    listingDetail: boolean;
    negotiationComments: boolean;
  };
  offerForm: OfferFormValues | null;
  negotiationComments: IMessageKeyValue | null;
}

export interface ICurrentOffer {
  type: ListingType;
  listingId: number;
  threadId?: string;
}

export interface IExistingProposalsLease {
  expectedPrice: string;
  securityDeposit: string;
  minimumLeasePeriod: number;
  maximumLeasePeriod: number;
  annualRentIncrementPercentage: string;
  availableFromDate: string;
  maintenancePaidBy: string;
  utilityPaidBy: string;
  tenantPreferences: ICheckboxGroupData[];
  message: string;
}

export interface IExistingProposalsSale {
  expectedPrice: string;
  expectedBookingAmount: string;
  message: string;
}

export type OfferFormValues = IExistingProposalsLease | IExistingProposalsSale;

export interface IOfferCompare {
  rent?: number;
  price?: number;
  deposit?: number;
  bookingAmount?: number;
  incrementPercentage?: number;
}

export interface IFormattedDetails {
  type: string;
  value: string | number | null;
}

export interface IGetNegotiationComments {
  isNew?: boolean;
}
