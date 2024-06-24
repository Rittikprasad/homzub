import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { IInvoiceItem, InvoiceItem } from '@homzhub/common/src/domain/models/InvoiceItem';

export interface IInvoiceSummary {
  id: number;
  title: string;
  description: string;
  currency: ICurrency;
  total_price: number;
  total_base_price: number;
  total_tax: number;
  total_price_payable: number;
  total_discount: number;
  sub_total: number;
  coins: number | null;
  promo: number | null;
  user_invoice_items: IInvoiceItem[];
}

@JsonObject('InvoiceId')
export class InvoiceId {
  @JsonProperty('user_invoice_id', Number)
  private _userInvoiceId = 0;

  get userInvoiceId(): number {
    return this._userInvoiceId;
  }
}

@JsonObject('InvoiceSummary')
export class InvoiceSummary {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('total_price', Number)
  private _totalPrice = -1;

  @JsonProperty('total_base_price', Number)
  private _totalBasePrice = -1;

  @JsonProperty('total_tax', Number)
  private _totalTax = -1;

  @JsonProperty('total_price_payable', Number)
  private _totalPricePayable = -1;

  @JsonProperty('total_discount', Number)
  private _totalDiscount = -1;

  @JsonProperty('sub_total', Number)
  private _subTotal = -1;

  @JsonProperty('coins', Number, true)
  private _coins = null;

  @JsonProperty('promo', Number, true)
  private _promo = null;

  @JsonProperty('user_invoice_items', [InvoiceItem])
  private _userInvoiceItems = [];

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get currency(): Currency {
    return this._currency;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  get totalBasePrice(): number {
    return this._totalBasePrice;
  }

  get totalTax(): number {
    return this._totalTax;
  }

  get totalPricePayable(): number {
    return this._totalPricePayable;
  }

  get totalDiscount(): number {
    return this._totalDiscount;
  }

  get subTotal(): number {
    return this._subTotal;
  }

  get coins(): number | null {
    return this._coins;
  }

  get promo(): number | null {
    return this._promo;
  }

  get userInvoiceItems(): InvoiceItem[] {
    return this._userInvoiceItems;
  }

  get invoiceSummary(): { title: string; value: string }[] {
    return this.userInvoiceItems.map((item) => {
      return {
        title: item.itemName,
        value: `${this.currency.currencySymbol} ${item.posPrice}`,
      };
    });
  }

  get formattedPrice(): string {
    return `${this.currency.currencySymbol} ${this.totalPricePayable}`;
  }
}
