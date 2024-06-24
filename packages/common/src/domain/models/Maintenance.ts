import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';

export interface IMaintenance {
  amount: number | null;
  currency: ICurrency;
}

@JsonObject('Maintenance')
export class Maintenance {
  @JsonProperty('amount', Number, true)
  private _amount = null;

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  get amount(): number | null {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }
}
