import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ISocietyBankInfo {
  id: number;
  beneficiary_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  is_verified: boolean;
}

@JsonObject('SocietyBankInfo')
export class SocietyBankInfo {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('beneficiary_name', String)
  private _beneficiaryName = '';

  @JsonProperty('bank_name', String)
  private _bankName = '';

  @JsonProperty('account_number', String)
  private _accountNumber = '';

  @JsonProperty('ifsc_code', String)
  private _ifscCode = '';

  @JsonProperty('is_verified', Boolean)
  private _isVerified = false;

  get id(): number {
    return this._id;
  }

  get beneficiaryName(): string {
    return this._beneficiaryName;
  }

  get bankName(): string {
    return this._bankName;
  }

  get accountNumber(): string {
    return this._accountNumber;
  }

  get ifscCode(): string {
    return this._ifscCode;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }
}
