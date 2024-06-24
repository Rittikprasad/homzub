import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('IfscDetail')
export class IfscDetail {
  @JsonProperty('DISTRICT', String)
  private _district = '';

  @JsonProperty('STATE', String)
  private _state = '';

  @JsonProperty('IMPS', Boolean)
  private _imps = false;

  @JsonProperty('RTGS', Boolean)
  private _rtgs = false;

  @JsonProperty('CENTRE', String)
  private _center = '';

  @JsonProperty('UPI', Boolean)
  private _upi = false;

  @JsonProperty('ADDRESS', String)
  private _address = '';

  @JsonProperty('BRANCH', String)
  private _branch = '';

  @JsonProperty('NEFT', Boolean)
  private _neft = false;

  @JsonProperty('CITY', String)
  private _city = '';

  @JsonProperty('SWIFT', String)
  private _swift = '';

  @JsonProperty('MICR', String)
  private _micr = '';

  @JsonProperty('CONTACT', String)
  private _contact = '';

  @JsonProperty('BANK', String)
  private _bank = '';

  @JsonProperty('BANKCODE', String)
  private _bankCode = '';

  @JsonProperty('IFSC', String)
  private _ifsc = '';

  get district(): string {
    return this._district;
  }

  get state(): string {
    return this._state;
  }

  get imps(): boolean {
    return this._imps;
  }

  get rtgs(): boolean {
    return this._rtgs;
  }

  get center(): string {
    return this._center;
  }

  get upi(): boolean {
    return this._upi;
  }

  get address(): string {
    return this._address;
  }

  get branch(): string {
    return this._branch;
  }

  get neft(): boolean {
    return this._neft;
  }

  get city(): string {
    return this._city;
  }

  get swift(): string {
    return this._swift;
  }

  get micr(): string {
    return this._micr;
  }

  get contact(): string {
    return this._contact;
  }

  get bank(): string {
    return this._bank;
  }

  get bankCode(): string {
    return this._bankCode;
  }

  get ifsc(): string {
    return this._ifsc;
  }
}
