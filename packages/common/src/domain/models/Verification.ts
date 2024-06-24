import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IVerifications {
  verification_status: number;
  description: string;
}

@JsonObject('Verification')
export class Verification {
  @JsonProperty('verification_status', Number)
  private _verificationStatus = 0;

  @JsonProperty('description', String)
  private _description = '';

  get verificationStatus(): number {
    return this._verificationStatus;
  }

  get description(): string {
    return this._description;
  }
}
