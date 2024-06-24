import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ICurrency {
  currency_name: string;
  currency_symbol: string;
  currency_code: string;
}

@JsonObject('Currency')
export class Currency {
  @JsonProperty('currency_name', String)
  private _currencyName = 'INR';

  @JsonProperty('currency_symbol', String)
  private _currencySymbol = '₹';

  @JsonProperty('currency_code', String)
  private _currencyCode = 'INR';

  get currencyName(): string {
    return this._currencyName;
  }

  get currencySymbol(): string {
    return this._currencySymbol;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }
}
