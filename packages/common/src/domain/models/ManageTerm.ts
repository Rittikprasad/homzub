import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { LeaseTerm, ILeaseTermParams } from '@homzhub/common/src/domain/models/LeaseTerm';

export interface IManageTerm extends ILeaseTermParams {
  first_name: string;
  last_name: string;
  email: string;
  phone_code: string;
  phone_number: string;
}

@JsonObject('ManageTerm')
export class ManageTerm extends LeaseTerm {
  @JsonProperty('first_name', String)
  private _firstName = '';

  @JsonProperty('last_name', String)
  private _lastName = '';

  @JsonProperty('email', String)
  private _email = '';

  @JsonProperty('phone_code', String)
  private _phoneCode = '';

  @JsonProperty('phone_number', String)
  private _phoneNumber = '';

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get phoneCode(): string {
    return this._phoneCode;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }
}
