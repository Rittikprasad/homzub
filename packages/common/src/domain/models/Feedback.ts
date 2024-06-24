import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IFeedback {
  id: number;
  is_tenant_interested: boolean;
  is_tenant_shortlisted: boolean;
  negotiation_raised: number;
  requests: string;
  remarks: string;
  reject_reason: IUnit;
}
@JsonObject('Feedback')
export class Feedback {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('is_tenant_interested', Boolean)
  private _isTenantInterested = false;

  @JsonProperty('is_tenant_shortlisted', Boolean)
  private _isTenantShortlisted = false;

  @JsonProperty('negotiation_raised', Number, true)
  private _negotiationRaised = null;

  @JsonProperty('requests', String)
  private _requests = '';

  @JsonProperty('remarks', String)
  private _remarks = '';

  @JsonProperty('reject_reason', Unit)
  private _rejectReason = new Unit();

  get id(): number {
    return this._id;
  }

  get isTenantInterested(): boolean {
    return this._isTenantInterested;
  }

  get isTenantShortlisted(): boolean {
    return this._isTenantShortlisted;
  }

  get negotiationRaised(): number | null {
    return this._negotiationRaised;
  }

  get requests(): string {
    return this._requests;
  }

  get remarks(): string {
    return this._remarks;
  }

  get rejectReason(): Unit {
    return this._rejectReason;
  }
}
