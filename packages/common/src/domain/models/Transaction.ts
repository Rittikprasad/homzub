import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface ITransactionType extends IUnit {
  title: string;
  label: string;
  min_price: number;
  max_price: number;
}

@JsonObject('TransactionType')
export class TransactionType extends Unit {
  @JsonProperty('min_price', Number, true)
  private _minPrice = 0;

  @JsonProperty('max_price', Number, true)
  private _maxPrice = 0;

  get minPrice(): number {
    return this._minPrice;
  }

  get maxPrice(): number {
    return this._maxPrice;
  }
}
