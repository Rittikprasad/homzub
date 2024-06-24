import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ITicketAction {
  code: string;
  label: string;
  is_allowed: boolean;
  is_next: boolean;
}

@JsonObject('TicketAction')
export class TicketAction {
  @JsonProperty('code', String)
  private _code = '';

  @JsonProperty('label', String)
  private _label = '';

  @JsonProperty('is_allowed', Boolean)
  private _isAllowed = false;

  @JsonProperty('is_next', Boolean)
  private _isNext = false;

  get code(): string {
    return this._code;
  }

  get label(): string {
    return this._label;
  }

  get isAllowed(): boolean {
    return this._isAllowed;
  }

  get isNext(): boolean {
    return this._isNext;
  }
}
