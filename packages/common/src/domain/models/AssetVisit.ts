import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { IUser, User, UserRole } from '@homzhub/common/src/domain/models/User';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IVisitAssetDetail, VisitAssetDetail } from '@homzhub/common/src/domain/models/VisitAssetDetail';
import { VisitStatus, VisitType } from '@homzhub/common/src/domain/repositories/interfaces';

// ENUM START

export enum VisitActions {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
  SCHEDULED = 'SCHEDULED',
  AWAITING = 'AWAITING',
}

export enum RoleType {
  PROPERTY_AGENT = 'PROPERTY_AGENT',
  TENANT = 'TENANT',
  BUYER = 'BUYER',
  OWNER = 'OWNER',
}

// ENUM END

export interface ISlotItem {
  id: number;
  from: number;
  to: number;
  icon: string;
  formatted: string;
}

export interface IVisitActions {
  title: string;
  color: string;
  icon?: string;
  action?: (id: number) => void;
}

export interface IVisitByKey {
  key: string;
  results: AssetVisit[] | VisitAssetDetail[];
  totalVisits?: number;
}

export interface IAssetVisit {
  id: number;
  visit_type: string;
  lead_type: IUnit;
  start_date: string;
  end_date: string;
  comments: string;
  sale_listing: number | null;
  lease_listing: number | null;
  status: VisitStatus;
  user: IUser;
  role: UserRole;
  asset: IVisitAssetDetail;
  actions: string[];
  created_at: string;
}

@JsonObject('AssetVisit')
export class AssetVisit {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('visit_type', String)
  private _visitType = '';

  @JsonProperty('start_date', String)
  private _startDate = '';

  @JsonProperty('end_date', String)
  private _endDate = '';

  @JsonProperty('lead_type', Unit, true)
  private _leadType = new Unit();

  @JsonProperty('comments', String, true)
  private _comments = '';

  @JsonProperty('sale_listing', Number, true)
  private _saleListing = 0;

  @JsonProperty('lease_listing', Number, true)
  private _leaseListing = 0;

  @JsonProperty('status', String)
  private _status = '';

  @JsonProperty('user', User)
  private _user = new User();

  @JsonProperty('role', String)
  private _role = '';

  @JsonProperty('is_asset_owner', Boolean, true)
  private _isAssetOwner = false;

  @JsonProperty('is_valid_visit', Boolean, true)
  private _isValidVisit = false;

  @JsonProperty('created_at', String)
  private _createdAt = '';

  @JsonProperty('updated_at', String, true)
  private _updatedAt = '';

  @JsonProperty('actions', [String])
  private _actions = [];

  @JsonProperty('asset', VisitAssetDetail)
  private _asset = new VisitAssetDetail();

  @JsonProperty('review', AssetReview, true)
  private _review: AssetReview | null = null;

  get id(): number {
    return this._id;
  }

  get visitType(): VisitType {
    return this._visitType as VisitType;
  }

  get startDate(): string {
    return this._startDate;
  }

  get endDate(): string {
    return this._endDate;
  }

  get leadType(): Unit {
    return this._leadType;
  }

  get comments(): string {
    return this._comments;
  }

  get saleListing(): number | null {
    return this._saleListing;
  }

  get leaseListing(): number | null {
    return this._leaseListing;
  }

  get status(): string {
    return this._status;
  }

  get user(): User {
    return this._user;
  }

  get role(): RoleType {
    return this._role as RoleType;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get actions(): VisitActions[] {
    return this._actions as VisitActions[];
  }

  get asset(): VisitAssetDetail {
    return this._asset;
  }

  get isAssetOwner(): boolean {
    return this._isAssetOwner;
  }

  get isValidVisit(): boolean {
    return this._isValidVisit;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  get review(): AssetReview | null {
    return this._review;
  }
}
