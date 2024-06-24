import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IProspectProfile, ProspectProfile } from '@homzhub/common/src/domain/models/ProspectProfile';
import { ITenantPreference, TenantPreference } from '@homzhub/common/src/domain/models/TenantInfo';
import { IUser, User } from '@homzhub/common/src/domain/models/User';
import { Unit } from '@homzhub/common/src/domain/models/Unit';

export enum Status {
  PENDING = 'NEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum OfferAction {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
  COUNTER = 'COUNTER',
  REASON = 'REASON',
  CONFIRMARION = 'CONFIRMATION',
  CREATE_LEASE = 'CREATE_LEASE',
}

export enum OfferFormKeys {
  expectedRent = 'expectedPrice',
  securityDeposit = 'securityDeposit',
  minimumLeasePeriod = 'minimumLeasePeriod',
  maximumLeasePeriod = 'maximumLeasePeriod',
  annualRentIncrementPercentage = 'annualRentIncrementPercentage',
  availableFromDate = 'availableFromDate',
  tenantPreferences = 'tenantPreferences',
  message = 'message',
  // Sale Flow
  expectedSellPrice = 'expectedPrice',
  expectedBookingAmount = 'expectedBookingAmount',
}

export interface IOfferValue {
  key: string;
  value: string;
  icon?: string;
  iconColor?: string;
}

export interface IOffer {
  id?: number;
  prospect: IProspectProfile;
  created_at: string;
  expires_at: string;
  proposed_rent?: number;
  proposed_price?: number;
  proposed_security_deposit?: number;
  proposed_booking_amount?: number;
  proposed_annual_rent_increment_percentage?: number;
  proposed_move_in_date?: string;
  proposed_lease_period?: number;
  proposed_min_lock_in_period?: number;
  tenant_preferences?: ITenantPreference[];
  actions?: string[];
  status?: string;
  role?: string;
  status_updated_at?: string;
  status_updated_by?: IUser;
  can_counter?: boolean;
  is_asset_owner?: boolean;
  user?: IUser;
  status_updated_by_role?: string;
  thread_id?: string;
  comments_count?: number;
}

@JsonObject('Offer')
export class Offer {
  @JsonProperty('id', Number, true)
  private _id = -1;

  @JsonProperty('prospect', ProspectProfile, true)
  private _prospect = new ProspectProfile();

  @JsonProperty('created_at', String, true)
  private _createdAt = '';

  @JsonProperty('expires_at', String, true)
  private _expiresAt = '';

  @JsonProperty('proposed_rent', Number, true)
  private _rent = -1;

  @JsonProperty('proposed_price', Number, true)
  private _price = -1;

  @JsonProperty('proposed_security_deposit', Number, true)
  private _securityDeposit = -1;

  @JsonProperty('proposed_booking_amount', Number, true)
  private _bookingAmount = -1;

  @JsonProperty('proposed_annual_rent_increment_percentage', Number, true)
  private _annualRentIncrementPercentage = null;

  @JsonProperty('proposed_move_in_date', String, true)
  private _moveInDate = '';

  @JsonProperty('proposed_lease_period', Number, true)
  private _leasePeriod = -1;

  @JsonProperty('proposed_min_lock_in_period', Number, true)
  private _minLockInPeriod = -1;

  @JsonProperty('tenant_preferences', [TenantPreference], true)
  private _tenantPreferences = [];

  @JsonProperty('actions', [String], true)
  private _actions = [];

  @JsonProperty('status', String, true)
  private _status = '';

  @JsonProperty('role', String, true)
  private _role = '';

  @JsonProperty('status_updated_at', String, true)
  private _statusUpdatedAt = null;

  @JsonProperty('status_updated_by', User, true)
  private _statusUpdatedBy = null;

  @JsonProperty('can_counter', Boolean, true)
  private _canCounter = false;

  @JsonProperty('counter_offers_count', Number, true)
  private _counterOffersCount = 0;

  @JsonProperty('can_create_lease', Boolean, true)
  private _canCreateLease = false;

  @JsonProperty('is_asset_owner', Boolean, true)
  private _isAssetOwner = false;

  @JsonProperty('user', User, true)
  private _user = new User();

  @JsonProperty('status_change_comment', String, true)
  private _statusChangeComment = '';

  @JsonProperty('status_change_reason', Unit, true)
  private _statusChangeReason = null;

  @JsonProperty('status_updated_by_role', String, true)
  private _statusUpdatedByRole = null;

  @JsonProperty('thread_id', String, true)
  private _threadId = '';

  @JsonProperty('comments_count', Number, true)
  private _commentsCount = -1;

  get id(): number {
    return this._id;
  }

  get prospect(): ProspectProfile {
    return this._prospect;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get rent(): number {
    return this._rent;
  }

  get securityDeposit(): number {
    return this._securityDeposit;
  }

  get annualRentIncrementPercentage(): number | null {
    return this._annualRentIncrementPercentage;
  }

  get moveInDate(): string {
    return this._moveInDate;
  }

  get leasePeriod(): number {
    return this._leasePeriod;
  }

  get minLockInPeriod(): number {
    return this._minLockInPeriod;
  }

  get tenantPreferences(): TenantPreference[] {
    return this._tenantPreferences;
  }

  get actions(): string[] {
    return this._actions;
  }

  get status(): Status {
    return this._status as Status;
  }

  get canCounter(): boolean {
    return this._canCounter;
  }

  get price(): number {
    return this._price;
  }

  get bookingAmount(): number {
    return this._bookingAmount;
  }

  get role(): string {
    return this._role;
  }

  get statusUpdatedAt(): string | null {
    return this._statusUpdatedAt;
  }

  get statusUpdatedBy(): User | null {
    return this._statusUpdatedBy;
  }

  get user(): User {
    return this._user;
  }

  get expiresAt(): string {
    return this._expiresAt;
  }

  get validCount(): number {
    return DateUtils.getHours(this.expiresAt);
  }

  get validDays(): string {
    const { t } = I18nService;
    const count = this.validCount;
    const text = count > 1 ? t('common:hours') : t('common:hour');
    return count >= 0 ? `${count} ${text}` : t('common:expired');
  }

  get isAssetOwner(): boolean {
    return this._isAssetOwner;
  }

  get statusChangeComment(): string {
    return this._statusChangeComment;
  }

  get statusChangeReason(): Unit | null {
    return this._statusChangeReason;
  }

  get counterOffersCount(): number {
    return this._counterOffersCount;
  }

  get canCreateLease(): boolean {
    return this._canCreateLease;
  }

  get statusUpdatedByRole(): string | null {
    return this._statusUpdatedByRole;
  }

  get threadId(): string {
    return this._threadId;
  }

  get commentsCount(): number {
    return this._commentsCount;
  }
}
