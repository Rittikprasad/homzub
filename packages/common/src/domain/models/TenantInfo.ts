import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ILeasePeriod, LeasePeriod } from '@homzhub/common/src/domain/models/LeaseTransaction';
import { IUser, User } from '@homzhub/common/src/domain/models/User';

export interface IList {
  id: number;
  label: string;
  isSelected: boolean;
}

export interface ITenantInfo {
  id?: number;
  is_invite_accepted?: boolean;
  lease_tenant_id?: number;
  invite_sent_at?: string;
  lease_unit_id?: string;
  lease_transaction?: ILeasePeriod;
  tenant_user?: IUser;
  user?: IUser;
}

@JsonObject('TenantInfo')
export class TenantInfo {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('is_invite_accepted', Boolean, true)
  private _isInviteAccepted = true;

  @JsonProperty('lease_tenant_id', Number, true)
  private _leaseTenantId = 0;

  @JsonProperty('invite_sent_at', String, true)
  private _inviteSentAt = '';

  @JsonProperty('lease_unit_id', Number, true)
  private _leaseUnitId = 0;

  @JsonProperty('lease_transaction', LeasePeriod, true)
  private _leaseTransaction: LeasePeriod | null = null;

  @JsonProperty('tenant_user', User, true)
  private _tenantUser: User = new User();

  @JsonProperty('user', User, true)
  private _user: User = new User();

  get isInviteAccepted(): boolean {
    return this._isInviteAccepted;
  }

  get leaseTenantId(): number {
    return this._leaseTenantId;
  }

  get user(): User {
    return this._user;
  }

  get id(): number {
    return this._id;
  }

  get leaseUnitId(): number {
    return this._leaseUnitId;
  }

  get leaseTransaction(): LeasePeriod | null {
    return this._leaseTransaction;
  }

  get tenantUser(): User | null {
    return this._tenantUser;
  }

  get inviteSentAt(): string {
    return this._inviteSentAt;
  }

  get inviteSentTime(): number {
    return DateUtils.getDateDifference(this.inviteSentAt);
  }
}

export interface ITenantPreference {
  id: number;
  name: string;
  is_choosed?: boolean;
}

@JsonObject('TenantPreference')
export class TenantPreference {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('is_choosed', Boolean, true)
  private _isSelected = false;

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get isSelected(): boolean {
    return this._isSelected;
  }
}
