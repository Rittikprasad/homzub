import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IPhoneCode {
  phone_code: string;
  phone_number_max_length: number;
  phone_number_min_length: number;
}

@JsonObject('PhoneCode')
export class PhoneCode {
  @JsonProperty('phone_code', String, true)
  private _phoneCode = '';

  @JsonProperty('phone_number_max_length', Number, true)
  private _phoneNumberMaxLength = 0;

  @JsonProperty('phone_number_min_length', Number, true)
  private _phoneNumberMinLength = 0;

  get phoneCode(): string {
    return this._phoneCode;
  }

  get phoneNumberMaxLength(): number {
    return this._phoneNumberMaxLength;
  }

  get phoneNumberMinLength(): number {
    return this._phoneNumberMinLength;
  }
}
