import { Data } from '@homzhub/common/src/domain/models/Asset';
import { ContactActions } from '@homzhub/common/src/domain/models/Search';
import { SocialAuthKeys } from '@homzhub/common/src/constants/SocialAuthProviders';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';

export enum AuthenticationType {
  EMAIL = 'email',
  OTP = 'otp',
  REFERRAL = 'referral',
}

export enum ListingType {
  RENT = 'Rent',
  SELL = 'Sell',
}

export interface IAuthenticationEvent {
  source: AuthenticationType | SocialAuthKeys;
  email?: string;
  phone_number?: string;
  error?: string;
}

export interface IAddPropertyEvent {
  property_address: string;
  error?: string;
}

export interface IContactOwnerEvent {
  source: ContactActions;
  property_address: string;
}

export interface IPropertyEvent {
  project_name: string;
  property_address: string;
  asset_group_type: string;
  listing_type?: ListingType;
  price: number;
  bedroom?: number;
  bathroom?: number;
  area?: number;
}

export interface ISearchEvent {
  search_string: string;
  listing_type: ListingType;
  asset_group_type: string;
  price_range?: string;
  bedroom?: number;
  bathroom?: number;
  area?: number;
  error?: string;
}

export interface IReferEvent {
  source: string;
  code: string;
}

export interface IPropertyShareEvent extends IPropertyEvent {
  source: string;
}

export interface IVisitEvent extends IPropertyEvent {
  start_date: string;
  end_date: string;
}

export interface IMessageEvent {
  group_name: string;
}

export interface IAddServiceEvent {
  property_location: string;
  project_name: string;
  city: string;
  country: string;
  asset_group: Data;
  asset_type: Data;
}

export interface ICloseTicketEvent {
  project_name: string;
  ticketId: number;
}

export interface IExtraTrackData {
  listing_type?: ListingType;
  price?: number;
}

export interface IComponentError {
  isComponentError: boolean;
  componentStack: string;
  message: string;
}

export interface IVASBought {
  address: string;
}

export type EventDataType =
  | IAuthenticationEvent
  | IAddPropertyEvent
  | IContactOwnerEvent
  | IPropertyEvent
  | ISearchEvent
  | IReferEvent
  | IPropertyShareEvent
  | IVisitEvent
  | IMessageEvent
  | IAddServiceEvent
  | ICloseTicketEvent
  | IApiClientError
  | IComponentError
  | IVASBought;
