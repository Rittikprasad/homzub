import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IInvites {
  total_accepted: number;
}

@JsonObject('Invites')
export class Invites {
  @JsonProperty('total_accepted', Number)
  private _totalAccepted = 0;

  get totalAccepted(): number {
    return this._totalAccepted;
  }
}
