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
  LeaseUnitId = 'lease_unit_id',
  MessageGroupId = 'message_group_id',
  MessageGroupName = 'message_group_name',
}

export interface IDynamicLinkParams {
  routeType: any;
  type: any;
  params: any;
}
