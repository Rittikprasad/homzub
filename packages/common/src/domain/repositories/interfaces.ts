import { OSTypes } from '@homzhub/common/src/utils/PlatformUtils';
import { VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { DueOrderSummaryAction } from '@homzhub/common/src/domain/models/DueOrderSummary';
import { ILeaseTermParams } from '@homzhub/common/src/domain/models/LeaseTerm';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { SelectedPreferenceType } from '@homzhub/common/src/domain/models/SettingOptions';
import { SocialAuthKeys } from '@homzhub/common/src/constants/SocialAuthProviders';
import { PaidByTypes } from '@homzhub/common/src/constants/Terms';

// ENUMS

export enum LoginTypes {
  OTP = 'OTP_LOGIN',
  EMAIL = 'EMAIL_LOGIN',
  SOCIAL_MEDIA = 'SOCIAL_LOGIN',
}

export enum OtpActionTypes {
  SEND = 'SEND_OTP',
  VERIFY = 'VERIFY_OTP',
  SEND_EMAIL_OTP = 'SEND_EMAIL_OTP',
}

export enum SpaceAvailableTypes {
  BATHROOM = 'Bathroom',
  BEDROOM = 'Bedroom',
  TOTAL_FLOORS = 'Total Floors',
  FLOOR_NUMBER = 'Floor number',
  BALCONY = 'Balcony',
  OPEN_PARKING = 'Open Parking',
}

export enum VisitType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
  PROPERTY_VIEW = 'PROPERTY_VIEW',
}

export enum VisitStatus {
  APPROVED = 'APPROVED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

export enum ResetPasswordTypes {
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  SET_PASSWORD = 'SET_PASSWORD',
  SEND_EMAIL = 'SEND_EMAIL',
}

export enum UpdateProfileTypes {
  GET_OTP_OR_UPDATE = 'GET_OTP_OR_UPDATE',
  UPDATE_BY_OTP = 'UPDATE_BY_OTP',
}

export enum DetailType {
  ASSET = 'detail',
  LEASE_LISTING = 'lease-listing',
  SALE_LISTING = 'sale-listing',
  LEASE_UNIT = 'lease-unit',
}

export enum EmailVerificationActions {
  GET_VERIFICATION_EMAIL = 'GET_VERIFICATION_EMAIL',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

export enum PaymentFailureResponse {
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED',
}

export enum ClosureReasonType {
  LEASE_TRANSACTION_TERMINATION = 'LEASE_TRANSACTION_TERMINATION',
  LEASE_LISTING_CANCELLATION = 'LEASE_LISTING_CANCELLATION',
  SALE_LISTING_CANCELLATION = 'SALE_LISTING_CANCELLATION',
  LEASE_NEGOTIATION_REJECTION = 'LEASE_NEGOTIATION_REJECTION',
  SALE_NEGOTIATION_REJECTION = 'SALE_NEGOTIATION_REJECTION',
  LEASE_NEGOTIATION_CANCELLATION = 'LEASE_NEGOTIATION_CANCELLATION',
  SALE_NEGOTIATION_CANCELLATION = 'SALE_NEGOTIATION_CANCELLATION',
}

export enum ListingType {
  LEASE_LISTING = 'lease-listings',
  SALE_LISTING = 'sale-listings',
}

export enum NegotiationType {
  LEASE_NEGOTIATIONS = 'lease-negotiations',
  SALE_NEGOTIATIONS = 'sale-negotiations',
}

export enum NegotiationOfferType {
  CREATED = 'created',
  RECEIVED = 'received',
}

export enum OfferFilterType {
  CREATED = 'offers-created',
  RECEIVED = 'offers-received',
  DETAIL = 'offers-detail',
}

export enum NegotiationAction {
  REJECT = 'REJECT',
  ACCEPT = 'ACCEPT',
  CANCEL = 'CANCEL',
}

export enum MessageAction {
  READ = 'READ',
}

export enum TicketAction {
  COMPLETE_TICKET = 'COMPLETE_TICKET',
  CLOSE_TICKET = 'CLOSE_TICKET',
  WORK_INITIATED = 'WORK_INITIATED',
  WORK_UPDATE = 'WORK_UPDATE',
  REJECT_TICKET = 'REJECT_TICKET',
}

export enum PurchaseTypes {
  APPLE_PURCHASE = 'APPLE_PURCHASE',
}

export enum DuePaymentActions {
  PAYMENT_CAPTURED = 'PAYMENT_CAPTURED',
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED',
}

export enum InvoiceActions {
  TICKET_ORDER_SUMMARY = 'TICKET_ORDER_SUMMARY',
  TICKET_INVOICE = 'TICKET_INVOICE',
  SOCIETY_MAINTENANCE_INVOICE = 'SOCIETY_MAINTENANCE_INVOICE',
}

export enum QuoteActions {
  REQUEST_MORE_QUOTE = 'REQUEST_MORE_QUOTE',
}

export enum StatusCategory {
  NEW = 'NEW',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum AppType {
  MAIN = 'MAIN',
  FFM = 'FFM',
}

// ENUMS - END

// USER AUTH - START
export interface ISignUpPayload {
  first_name: string;
  last_name?: string;
  email: string;
  phone_code: string;
  phone_number: string;
  password: string;
  signup_referral_code?: string;
  company?: ICompany;
  role?: number;
  work_locations?: IWorkLocation[];
}

export interface ICompany {
  name: string;
}

export interface IWorkLocation {
  name: string;
  latitude: number;
  longitude: number;
  postal_code?: string;
  city_name: string;
  country_name: string;
  state_name?: string;
  location_type?: string;
}

export interface ISocialSignUpPayload {
  provider: SocialAuthKeys;
  id_token: string;
  otp: string;
  phone_code: string;
  phone_number: string;
}

export interface IEmailLoginPayload {
  action: LoginTypes.EMAIL;
  payload: {
    email: string;
    password: string;
  };
}

export interface ILoginPayload {
  data: IEmailLoginPayload | IOtpLoginPayload;
  callback?: () => void;
  is_referral?: boolean;
  is_from_signup?: boolean;
  handleDynamicLink?: () => void;
}

export interface ISocialLogin {
  is_new_user?: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: {
    full_name: string;
    email: string;
    phone_code: string;
    phone_number: string;
  };
}

export interface ISocialLoginPayload {
  action: LoginTypes.SOCIAL_MEDIA;
  payload: {
    provider: string;
    id_token: string;
  };
}

export interface IOtpLoginPayload {
  action: LoginTypes.OTP;
  payload: {
    phone_code: string;
    phone_number: string;
    otp: string;
  };
}

export interface ILoginFormData {
  email: string;
  password: string;
  phone_code: string;
  phone_number: string;
}

export interface IForgotPasswordPayload {
  action: string;
  payload: {
    email?: string;
    verification_id?: string | number;
    invite_id?: string;
    password?: string;
  };
}

export interface IResetPasswordData {
  email_exists: boolean;
  token: string;
}

export interface IUserExistsData {
  is_exists: boolean;
}

export interface IUserPayload {
  full_name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  access_token: string;
  refresh_token: string;
}

// USER AUTH - END

// OTP - START
export interface IOtpSendPayload {
  phone_code: string;
  phone_number: string;
}

export interface IOtpVerifyPayload extends IOtpSendPayload {
  otp: string;
}

export interface IOtpVerify {
  action: OtpActionTypes;
  payload: IOtpSendPayload | IOtpVerifyPayload | { email: string };
}

export interface IOtpVerifyResponse {
  otp_verify?: boolean;
  otp_sent?: boolean;
}

// OTP - END

// REFRESH TOKEN - START
export interface IRefreshToken {
  access_token: string;
  refresh_token: string;
}

export interface IRefreshTokenPayload {
  refresh_token: string;
  device_id?: string;
}

// REFRESH TOKEN - END

// USER LOGOUT - START
export interface IUserDeactivateUserAccountPayload {
  action: string;
  payload: IRefreshTokenPayload;
}
export interface IUserLogoutPayload {
  action: string;
  payload: IRefreshTokenPayload;
}

// USER LOGOUT - END

// ASSET - START
export interface ISpaceAvailable {
  bedroom: number;
  bathroom: number;
  balcony: number;
  floorNumber: number;
  totalFloors: number;
  carpetArea: string;
  areaUnit: number;
}

export interface ISpaceAvailablePayload {
  space_type: string | number;
  name?: string;
  value?: number;
  count?: number;
  description?: string;
}

export interface ICreateAssetParams {
  project_name: string;
  unit_number: string;
  block_number: string;
  latitude: string | number;
  longitude: string | number;
  address: string;
  postal_code: string;
  city_name: string;
  state_name: string;
  country_name: string;
  country_iso2_code: string;
  asset_type: number;
  last_visited_step?: ILastVisitedStep;
  project?: number;
}

export interface ICreateAssetResult {
  id: number;
}

export interface IUpdateAssetParams {
  project_name?: string;
  unit_number?: string;
  block_number?: string;
  latitude?: string | number;
  longitude?: string | number;
  address?: string;
  postal_code?: string;
  city_name?: string;
  state_name?: string;
  country_iso2_code?: string;
  country_name?: string;
  carpet_area?: number;
  carpet_area_unit?: number;
  floor_number?: number;
  total_floors?: number;
  asset_type?: number;
  last_visited_step?: ILastVisitedStep;
  spaces?: ISpaceAvailablePayload[];
  asset_highlights?: string[];
  is_gated?: boolean;
  power_backup?: boolean;
  corner_property?: boolean;
  all_day_access?: boolean;
  amenities?: number[];
  facing?: string;
  floor_type?: number;
  furnishing_description?: string;
  construction_year?: number;
  furnishing?: string;
  is_subleased?: boolean;
  is_managed?: boolean;
  change_status?: boolean;
  project?: number;
}

// ASSET - END

// Property Search
export interface IPropertySearchPayload {
  asset_group?: number;
  price__gte?: number;
  price__lte?: number;
  latitude?: number;
  longitude?: number;
  limit?: number;
  offset?: number;
  bathroom__gte?: number;
  move_in_date__gte?: string;
  furnishing__in?: string;
  facing__in?: string;
  amenities__in?: string;
  rent_free_period?: number;
  is_verified?: boolean;
  agent_listed?: boolean;
  age__gte?: string;
  search_radius?: number;
  date_added?: string;
  asset_type__in?: string;
  bedroom__gte?: number;
  bedroom__in?: number;
  carpet_area__lte?: number;
  carpet_area__gte?: number;
  carpet_area_unit?: number;
}

// Lead
export interface ILeadPayload {
  propertyTermId: number;
  data: {
    spaces?: any;
    contact_person_type?: string;
    lead_type: string;
    message?: string;
    person_contacted?: number;
    preferred_contact_time?: any;
    is_wishlisted?: boolean;
    user_search?: null;
  };
}

export interface IGeneralLedgerPayload {
  transaction_date__lte: string;
  transaction_date__gte: string;
  transaction_date_group_by: string;
  asset_id?: number;
  country_id?: number;
}

export interface ITransactionParams {
  asset_id?: number;
  country_id?: number;
  offset: number;
  limit: number;
}

export interface IAddGeneralLedgerPayload {
  asset: number;
  entry_type: string;
  label: string;
  payer_name?: string;
  receiver_name?: string;
  amount: number;
  category: number;
  transaction_date: string;
  notes?: string | null;
  attachments: number[] | null;
  currency: string;
  mode_of_payment?: number;
  from_bank?: string;
  payment_reference_number?: string;
  invoice?: number;
}

export interface ICreateLedgerResult {
  id: number;
}

export interface INotificationsPayload {
  limit?: number;
  offset?: number;
  q?: string;
  lease_listing_id?: number;
  sale_listing_id?: number;
  asset_id?: number;
  lease_transaction_id?: number;
}

export interface IDocumentPayload {
  attachment: number;
  lease_listing_id?: number;
  sale_listing_id?: number;
}

export interface ICreateDocumentPayload {
  propertyId: number;
  documentData: IDocumentPayload[];
}

export interface IUpcomingVisitPayload {
  start_date__gte: string;
  visit_type: VisitType;
  sale_listing_id: number | null;
  lease_listing_id: number | null;
}

export interface IScheduleVisitPayload {
  visit_type: VisitType;
  lead_type: number;
  start_date: string;
  end_date: string;
  sale_listing: number | null;
  lease_listing: number | null;
  comments?: string;
  scheduled_for?: number;
}

export interface IPropertyImagesPostPayload {
  attachment: number;
  is_cover_image: boolean;
}

export interface IMarkCoverImageAttachment {
  cover_updated: boolean;
}

export interface IGetSaleTermsParams {
  status: 'DRAFT';
}

export interface IOrderSummaryPayload {
  value_added_services?: number[];
  coins?: number;
  promo_code?: string;
  asset?: number;
}

export interface IAssetVisitPayload {
  asset_id?: number;
  start_date?: string;
  start_datetime?: string;
  sale_listing_id?: number;
  lease_listing_id?: number;
  start_date__gte?: string;
  start_date__lte?: string;
  start_date__gt?: string;
  start_date__lt?: string;
  status?: VisitStatus;
  status__in?: string;
  status__neq?: VisitStatus;
  id?: number;
}

export interface IUpdateVisitPayload {
  id: number;
  data: {
    status: VisitActions;
  };
}

export interface IRescheduleVisitPayload {
  ids: number[];
  visit_type: VisitType;
  start_date: string;
  end_date: string;
  comments?: string;
}

export interface IUpdateEmergencyContact {
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_phone_code: string;
  emergency_contact_email: string;
}

export interface IUpdateWorkInfo {
  company_name: string;
  work_email: string;
}

interface IPasswordPayload {
  old_password: string;
  new_password: string;
}

export interface IUpdatePassword {
  action: ResetPasswordTypes;
  payload: IPasswordPayload;
}

export interface IProfileDetailsPayload {
  first_name: string;
  last_name: string;
  phone_code: string;
  phone_number: string;
  email: string;
  user_address: {
    address: string;
    postal_code: string;
    city_name: string;
    state_name: string;
    country_name: string;
    country_iso2_code: string;
  } | null;
}

export interface IUpdateProfilePayload {
  phone_otp?: string;
  new_phone?: boolean;
  email_otp?: string;
  new_email?: boolean;
  password?: string;
  profile_details: IProfileDetailsPayload;
}

export interface IUpdateProfileResponse {
  phone_otp?: boolean;
  new_phone?: boolean;
  email_otp?: boolean;
  new_email?: boolean;
  user_id?: number;
}

export interface IUpdateProfile {
  action: UpdateProfileTypes;
  payload: IUpdateProfilePayload;
}

export interface IPaymentParams {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  error_code?: PaymentFailureResponse;
  payment_transaction_id?: number;
  user_invoice_id?: number;
}

export interface ISupportPayload {
  support_category: number;
  title: string;
  description: string;
  attachments: number[];
}

export interface ISubscribeToNewsletterPayload {
  email: string;
}

export interface ILimitedOfferPayload {
  name: string;
  email: string;
  phone_number: string;
  origin: string;
}

export interface IUpdateUserPreferences {
  [name: string]: SelectedPreferenceType;
}

export interface IPropertyDetailPayload {
  asset_id: number;
  id: number;
  type: DetailType;
}

export interface ISendNotificationPayload {
  lease_listings: number[];
  sale_listing: number | null;
}

export interface IProfileImage {
  profile_picture: number;
}
export interface IEmailVerification {
  action: EmailVerificationActions;
  payload: IEmailVerificationPayload;
}

export interface IEmailVerificationPayload {
  email?: string;
  is_work_email?: boolean;
  verification_id?: string;
  verification_metadata?: {};
}

export interface IMarketTrendParams {
  limit?: number;
  offset?: number;
  q?: string;
  trend_type?: string;
}

export interface IReferralResponse {
  is_applicable: boolean;
}

export interface IVerifyAuthToken {
  provider: string;
  id_token: string;
}

export interface IVerifyAuthTokenResponse {
  is_new_user: boolean;
  is_token_verified: boolean;
}

export interface IClosureReasonPayload {
  type: ClosureReasonType;
  asset_group: number;
  asset_country: number;
}

export interface IListingParam {
  id?: number;
  endDate?: string;
  hasTakeAction?: boolean;
}

export interface ICancelListingParam {
  listingType: ListingType;
  listingId: number;
  assetId: number;
}

export interface ICancelListingPayload {
  param: ICancelListingParam;
  data: {
    cancel_reason: number;
    cancel_description?: string;
  };
}

export interface ITerminateListingPayload {
  id: number;
  data: {
    termination_reason: number;
    termination_date: string;
    termination_description?: string;
  };
}

export interface IListingReviewParams {
  lease_listing?: number;
  sale_listing?: number;
  rating: number;
  pillar_ratings: IPillarParam[];
  description?: string;
}

export interface IGetListingReviews {
  lease_listing?: number;
  sale_listing?: number;
}

export interface IAddReviewComment {
  comment: string;
}

export interface IReportReview {
  category: number;
  report_comment?: string;
}

export interface IUpdateTenantParam {
  assetId: number;
  leaseTransactionId: number;
  leaseTenantId: number;
}

export interface IUserDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  tenant_user?: number;
}

export interface IVisitActionParam {
  id: number;
  action?: VisitActions;
  isValidVisit?: boolean;
  isUserView?: boolean;
}

export interface IGetMessageParam {
  groupId: number;
  count?: number;
  cursor?: string;
  isNew?: boolean;
}

export interface IMessagePayload {
  groupId: number;
  message: string;
  attachments: number[];
}

export interface IGroupChatInfoPayload {
  groupId: number;
}

interface IMessageAction {
  action: MessageAction;
  payload: {
    read_at: string;
  };
}

export interface IUpdateMessagePayload {
  groupId: number;
  data: IMessageAction;
}

export interface IAcceptInvitePayload {
  inviteId?: string;
  isFromNavigation?: boolean;
}
export interface IUpdateLeaseTerm {
  transactionId: number;
  data: ILeaseTermData;
}

export interface ILeaseTermData {
  rent: number;
  security_deposit: number;
  lease_period: number;
  annual_rent_increment_percentage: number;
  maintenance_paid_by: PaidByTypes;
  utility_paid_by: PaidByTypes;
  lease_start_date: string;
  tentative_end_date: string;
  currency: string;
  minimum_lease_period: number;
  maintenance_amount: number | null;
  lease_listing_id?: number;
}

export interface IDeviceTokenPayload {
  registration_id: string;
  name: string;
  device_id: string;
  type: OSTypes;
  active?: boolean;
  homzhub_app_type?: AppType;
}

// SERVICE TICKETS START

export interface IServiceTicketForm {
  propertyId?: number;
  isFromDashboard?: boolean;
}

export interface IPostTicketPayload {
  ticket_category: number;
  asset: number;
  title: string;
  description?: string;
  others_field_description?: string;
  attachments: number[];
}

export interface IPostTicket {
  id: number;
}

export interface IQuoteParam {
  ticketId: number;
  quoteRequestId?: number;
}

export interface IQuoteData {
  quote_number: number;
  price: number;
  currency: string;
  attachment: number;
}

export interface IQuoteGroup {
  quote_request_category: number;
  quotes: IQuoteData[];
}

export interface IQuoteSubmitBody {
  quote_group: IQuoteGroup[];
  comment?: string;
}

export interface IQuoteSubmitPayload {
  param: IQuoteParam;
  data: IQuoteSubmitBody;
}

export interface ISubmitReviewData {
  rating: number;
  description?: string;
  pillar_ratings?: IPillarParam[];
}

export interface IPillarParam {
  pillar: number;
  rating: number;
}

export interface ISubmitReviewParam {
  ticketId: number;
  reviewId?: number;
}

export interface ISubmitReview {
  param: ISubmitReviewParam;
  data: ISubmitReviewData;
}

export interface IQuoteApproveBody {
  quotes: number[];
  comment?: string;
}

export interface IQuoteApprovePayload {
  param: IQuoteParam;
  data: IQuoteApproveBody;
}

export interface ICompleteTicketBody {
  action: TicketAction;
  payload: {
    comment?: string;
    attachments?: number[];
  };
}

export interface ICompleteTicketPayload {
  param: IQuoteParam;
  data: ICompleteTicketBody;
}

export interface IGetTicketParam {
  asset_id: number;
}

export interface IReassignTicketParam {
  assigned_to: number;
  comment?: string;
}

export interface IQuoteRequestParam {
  quote_request_categories: string[];
  is_homzhub_partner_invited: boolean;
  emails?: string[];
  comment?: string;
}

export interface ITitleWithComment {
  title?: string | null;
  comment?: string | null;
}

export interface IUpdateTicketWorkStatus {
  action: TicketAction;
  payload: ITitleWithComment;
}

// SERVICE TICKETS END

// OFFERS
export interface ISubmitOfferLease {
  proposed_rent: number;
  proposed_security_deposit: number;
  // proposed_rent_increment_percentage: number | null;
  proposed_annual_rent_increment_percentage: number | null;
  proposed_move_in_date: string;
  proposed_lease_period: number;
  proposed_min_lock_in_period: number;
  tenant_preferences: number[];
  comment?: string;
}

export interface IPostOfferLease {
  id: number;
}

export interface ISubmitOfferSell {
  proposed_price: number;
  proposed_booking_amount: number;
  comment?: string;
}

export interface IPostOfferSell {
  sale_negotiation: number;
}
export interface IUpdateProspectProfile {
  job_type: number;
  company_name: string;
  work_email: string | null;
  number_of_occupants: number;
  tenant_type: number;
}

export interface INegotiationParam {
  listingType: ListingType;
  listingId: number;
  negotiationType: NegotiationType;
  negotiationId?: number;
}

export interface INegotiation {
  param: INegotiationParam;
  filter_by?: string;
}

export interface INegotiationBody {
  action: NegotiationAction;
  payload: {
    status_change_reason?: number;
    status_change_comment?: string;
  };
}

export interface INegotiationPayload {
  param: INegotiationParam;
  data: INegotiationBody;
}

export interface IPropertyNegotiationParam {
  type: NegotiationOfferType;
  params?: IReceivedNegotiationParam;
}

export interface IReceivedNegotiationParam {
  countary_id?: number;
  type?: string;
  asset_id?: number;
  filter_by?: string;
}

export interface ISubmitOffer {
  param: INegotiationParam;
  data: ISubmitOfferLease | ISubmitOfferSell;
}

export interface ICounterParam {
  negotiationId: number;
  negotiationType: NegotiationType;
}

export interface ICounterOffer {
  param: ICounterParam;
  data: ISubmitOfferLease | ISubmitOfferSell;
}

export interface IOfferManagementParam {
  sale_listing_id?: number;
  lease_listing_id?: number;
}

export interface ICreateLeasePayload {
  negotiationId: number;
  body: ILeaseTermData;
}

export interface IPropertyOffersList {
  isReceivedFlow?: boolean;
}

// OFFERS END

export interface IFAQCategory {
  title: string;
  id: string;
  activeIcon?: string;
  inactiveIcon?: string;
}
interface IFAQAnswerRichText {
  html: any;
}
export interface IFAQs {
  question: string;
  answerRichText: IFAQAnswerRichText;
  category: IFAQCategory;
}

export interface IAssetListingParam {
  listingType: ListingType;
  listingId: number;
}

export interface IPurchasePayload {
  receipt_data: string;
  currency: string;
}

export interface IUpdatePlanPayload {
  action: PurchaseTypes;
  payload: IPurchasePayload;
}

export interface IUnitListingPayload {
  propertyId: number;
  unitId: number;
  leaseTerms: ILeaseTermParams;
}

export interface ILocationParam {
  latitude: number;
  longitude: number;
  name: string;
}

export interface ISearchRequirementPayload {
  min_budget: number;
  max_budget: number;
  asset_types: number[];
  search_txn_type: string;
  preferred_location: ILocationParam[];
  bhk: number[];
  available_from_date: string | null;
  user_location_latitude?: number | null;
  user_location_longitude?: number | null;
  comments?: string;
}

export interface IPaymentPayload {
  action: DuePaymentActions;
  payload: IPaymentParams;
}

export interface IReminderPayload {
  title: string;
  start_date: string;
  reminder_category: number;
  reminder_frequency: number;
  asset?: number;
  amount?: number;
  emails?: string[];
  currency?: string;
  payer_user?: number;
  description?: string;
  receiver_user?: number;
  user_bank_info?: number;
  lease_transaction?: number;
  society?: number;
  is_confirmed: boolean;
}

export interface IBankAccountPayload {
  beneficiary_name: string;
  bank_name: string;
  account_number: string;
  pan_number?: string;
  ifsc_code: string;
  is_confirmed: boolean;
}
export interface IAssetUserPayload {
  assetId: number;
  lease_transaction_id?: number;
  onCallback?: (status: boolean) => void;
}

export interface IDueOrderSummaryAction {
  action: DueOrderSummaryAction;
  coins?: number;
  promo_code?: string;
}

export interface IBookVisitProps {
  propertyTermId?: number;
  sale_listing_id?: number;
  lease_listing_id?: number;
  isReschedule?: boolean;
  userId?: number;
}

export interface IPayloadWithAction {
  action: string;
}

export interface ISummaryPayload {
  ticket: number;
  quotes?: number[];
}

export interface ISocietyInvoicePayload {
  amount: number;
  asset: number;
  currency: string;
  paid_by: number;
  is_notify_me_enabled: boolean;
  payment_schedule_date: string;
  reminder?: number;
}

export interface IInvoiceSummaryPayload extends IPayloadWithAction {
  payload: ISummaryPayload | ISocietyInvoicePayload;
}

export interface IRequestMore {
  action: string;
  payload: {
    quote_request_category: number;
    comment?: string;
  };
}

export interface IRequestMorePayload {
  data: IRequestMore;
  param: IQuoteParam;
  onCallback?: (status: boolean) => void;
}

export interface ISocietyParam {
  project_id: number;
}

export interface IBankInfoPayload {
  beneficiary_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
}

export interface ISocietyPayload {
  name: string;
  contact_name: string;
  contact_email: string;
  contact_number: string;
  project: number;
  asset: number;
  society_bank_info: IBankInfoPayload;
  is_terms_accepted: boolean;
}

export interface IAssetSocietyPayload {
  societyId: number;
  body: {
    asset: number;
    is_terms_accepted: boolean;
  };
}

export interface IProjectSearchPayload {
  latitude: number;
  longitude: number;
  name: string;
}

export interface IFFMVisitParam {
  status__in?: string;
  status?: string;
}

export interface IFeedback {
  is_tenant_interested: boolean;
  is_tenant_shortlisted?: boolean;
  negotiation_raised?: number;
  requests?: string;
  remarks?: string;
  reject_reason?: number | null;
}

export interface IPostFeedback {
  visitId: number;
  data: IFeedback;
}

export interface UserRole {
  data: object;
}

export interface IGetFeedbackParam {
  visitId: number;
  feedbackId: number;
}

export interface IDeepLinkPayload {
  type: string;
  routeType: string;
  propertyTermId: number;
  asset_transaction_type: number;
}

export interface IDeepLinkBody {
  action: string;
  payload: IDeepLinkPayload;
}

export interface IReportAction {
  title: string;
  color: string;
  iconColor?: string;
  icon?: string;
  isReverse?: boolean;
}

export interface IUpdateReport {
  reportId: number;
  status: string;
}

export interface IOutsetCheckParam {
  reportId: number;
  body: {
    latitude: number;
    longitude: number;
  };
}

export interface IReportSpaceParam {
  reportId: number;
  body: string[];
}

export interface ISpaceUnitUpdatePayload {
  id?: number | null;
  name?: string;
  condition_of_space?: number;
  attachments?: number[];
  comments?: string;
}

export interface ISpaceUpdatePayload {
  condition_of_space?: number;
  attachments?: number[];
  comments?: string;
  space_inspection_units: ISpaceUnitUpdatePayload[];
}

export interface IUpdateSpaceParam {
  reportId: number;
  spaceId: number;
  body: ISpaceUpdatePayload;
}

export interface IGetSpaceDetail {
  reportId: number;
  spaceId: number;
}

export interface IGetTicket {
  status_category: StatusCategory;
  priority?: string;
}

export interface IUpdateTicket {
  id: number;
  action: string;
}
