import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IEmergencyContact {
  name: string;
  phone_code: string;
  phone_number: string;
  email: string;
}

@JsonObject('EmergencyContact')
export class EmergencyContact {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('phone_code', String)
  private _phoneCode = '';

  @JsonProperty('phone_number', String)
  private _phoneNumber = '';

  @JsonProperty('email', String)
  private _email = '';

  get name(): string {
    return this._name;
  }

  get phoneCode(): string {
    return this._phoneCode;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  get email(): string {
    return this._email;
  }
}
