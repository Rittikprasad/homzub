import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IUser, User } from '@homzhub/common/src/domain/models/User';
import { VisitStatus } from '@homzhub/common/src/domain/repositories/interfaces';

export enum ReportStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  QA_APPROVED = 'QA_APPROVED',
  QA_REJECTED = 'QA_REJECTED',
}

export interface IReport {
  id: number;
  due_date: string;
  started_at: string | null;
  completed_at: string | null;
  completed_percentage: number;
  status: VisitStatus;
  users: IUser[];
  asset: IAsset;
  created_at: string;
  updated_at: string;
  status_updated_by: IUser | null;
  lease_listing: IUnit | null;
  sale_listing: IUnit | null;
  inspection_type: IUnit | null;
}

@JsonObject('Report')
export class Report {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('inspection_type', Unit, true)
  private _inspectionType = null;

  @JsonProperty('due_date', String)
  private _dueDate = '';

  @JsonProperty('started_at', String, true)
  private _startedAt = null;

  @JsonProperty('completed_at', String, true)
  private _completedAt = null;

  @JsonProperty('completed_percentage', Number)
  private _completedPercentage = 0;

  @JsonProperty('status', String)
  private _status = '';

  @JsonProperty('users', [User])
  private _users = [];

  @JsonProperty('created_at', String)
  private _createdAt = '';

  @JsonProperty('updated_at', String, true)
  private _updatedAt = '';

  @JsonProperty('status_updated_by', User, true)
  private _statusUpdatedBy = null;

  @JsonProperty('asset', Asset)
  private _asset = new Asset();

  @JsonProperty('lease_listing', Unit, true)
  private _leaseListing = null;

  @JsonProperty('sale_listing', Unit, true)
  private _saleListing = null;

  get id(): number {
    return this._id;
  }

  get dueDate(): string {
    return this._dueDate;
  }

  get completedPercentage(): number {
    return this._completedPercentage;
  }

  get status(): string {
    return this._status;
  }

  get users(): User[] {
    return this._users;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  get statusUpdatedBy(): User | null {
    return this._statusUpdatedBy;
  }

  get asset(): Asset {
    return this._asset;
  }

  get leaseListing(): Unit | null {
    return this._leaseListing;
  }

  get saleListing(): Unit | null {
    return this._saleListing;
  }

  get inspectionType(): Unit | null {
    return this._inspectionType;
  }

  get startedAt(): string | null {
    return this._startedAt;
  }

  get completedAt(): string | null {
    return this._completedAt;
  }
}
