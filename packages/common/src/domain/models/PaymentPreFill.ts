import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('PaymentPreFill')
export class PaymentPreFill {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('email', String)
  private _email = '';

  @JsonProperty('contact', String)
  private _contact = '';

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get contact(): string {
    return this._contact;
  }
}
