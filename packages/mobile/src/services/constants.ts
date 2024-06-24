// Enums related to dynamic linking - starts

export enum DynamicLinkTypes {
  AssetDescription = 'ASSET_DESCRIPTION',
  ResetPassword = 'RESET_PASSWORD',
  PrimaryEmailVerification = 'PRIMARY_EMAIL_VERIFICATION',
  WorkEmailVerification = 'WORK_EMAIL_VERIFICATION',
  Referral = 'REFERRAL',
  PropertyVisitReview = 'PROPERTY_VISIT_REVIEW',
  TenantInvitation = 'TENANT_INVITATION',
  ServiceTicket = 'SERVICE_TICKET',
  Offer = 'OFFER',
  Asset = 'ASSET',
  Due = 'DUE',
  UserProfile = 'USER_PROFILE',
}

export enum RouteTypes {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export enum DynamicLinkParamKeys {
  Type = 'type',
  RouteType = 'routeType',
  VerificationId = 'verificationId',
  PropertyTermId = 'propertyTermId',
  ReferralCode = 'referralCode',
  VisitId = 'visitId',
  InviteId = 'inviteId',
  TicketId = 'ticketId',
  SaleListingId = 'sale_listing_id',
  SaleNegotiationId = 'sale_negotiation_id',
  LeaseListingId = 'lease_listing_id',
  LeaseNegotiationId = 'lease_negotiation_id',
  Screen = 'screen',
  AssetId = 'asset_id',
  AssetName = 'asset_name',
  LeaseUnitId = 'lease_unit_id',
  MessageGroupId = 'message_group_id',
  MessageGroupName = 'message_group_name',
  AssetTransactionType = 'asset_transaction_type',
}

export enum NotificationScreens {
  OffersReceived = 'OFFERS_RECEIVED',
  OffersMade = 'OFFERS_MADE',
  OfferDetail = 'OFFER_DETAIL',
  OfferChats = 'chat',
}

// Enums related to dynamic linking - ends

export enum NotificationTypes {
  Chat = 'CHAT',
  ServiceTicket = 'SERVICE_TICKET',
  Offer = 'OFFER',
  Asset = 'ASSET',
  Campaign = 'CAMPAIGN',
  ValueAddedService = 'VALUE_ADDED_SERVICE',
  AssetDocuments = 'ASSET_DOCUMENT',
  ReferAndEarn = 'REFER_AND_EARN',
  Due = 'DUE',
}

/**
 * Apple Error code
 * Added because enum is not exported from lib
 */
export enum AppleErrorCode {
  USER_CANCELLED = '1001',
}
