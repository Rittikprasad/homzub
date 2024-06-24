import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IInvoiceItem {
  id: number;
  item_name: string;
  no_of_units: number;
  unit_price: number;
  pos_price: number;
}

@JsonObject('InvoiceItem')
export class InvoiceItem {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('item_name', String)
  private _itemName = '';

  @JsonProperty('no_of_units', Number)
  private _noOfUnits = 0;

  @JsonProperty('unit_price', Number)
  private _unitPrice = 0;

  @JsonProperty('pos_price', Number)
  private _posPrice = 0;

  get id(): number {
    return this._id;
  }

  get itemName(): string {
    return this._itemName;
  }

  get noOfUnits(): number {
    return this._noOfUnits;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get posPrice(): number {
    return this._posPrice;
  }
}
