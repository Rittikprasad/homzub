import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';

export interface IAmount {
  amount: number;
  currency: ICurrency;
}

@JsonObject('Amount')
export class Amount {
  @JsonProperty('amount', Number)
  private _amount = -1;

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  get amount(): number {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }

  get formattedAmount(): string {
    return `${this.currency.currencySymbol}${CurrencyUtils.getCurrency(this.currency.currencyCode, this.amount)}`;
  }
}
