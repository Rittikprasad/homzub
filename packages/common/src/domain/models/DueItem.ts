import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { PaymentTransaction } from '@homzhub/common/src/domain/models/PaymentTransaction';

export interface IDueItem {
  id: number;
  due_title: string;
  invoice_no: string;
  invoice_title: string;
  total_price: number;
  currency: ICurrency;
  asset: IAsset;
  can_delete: boolean;
  can_add_reminder: boolean;
}
@JsonObject('DueItem')
export class DueItem {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('due_title', String)
  private _dueTitle = '';

  @JsonProperty('invoice_no', String)
  private _invoiceNo = '';

  @JsonProperty('invoice_title', String)
  private _invoiceTitle = '';

  @JsonProperty('total_price', Number)
  private _totalPrice = -1;

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('asset', Asset, true)
  private _asset = null;

  @JsonProperty('payment_transaction', PaymentTransaction)
  private _paymentTransaction = new PaymentTransaction();

  @JsonProperty('created_at', String)
  private _createdAt = '';

  @JsonProperty('due_date', String)
  private _dueDate = '';

  @JsonProperty('can_delete', Boolean)
  private _canDelete = false;

  @JsonProperty('can_add_reminder', Boolean)
  private _canAddReminder = false;

  get id(): number {
    return this._id;
  }

  get dueTitle(): string {
    return this._dueTitle;
  }

  get invoiceNo(): string {
    return this._invoiceNo;
  }

  get invoiceTitle(): string {
    return this._invoiceTitle;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  get currency(): Currency {
    return this._currency;
  }

  get asset(): Asset | null {
    return this._asset;
  }

  get paymentTransaction(): PaymentTransaction {
    return this._paymentTransaction;
  }

  get totalDue(): string {
    return `${this.currency.currencySymbol}${CurrencyUtils.getCurrency(this.currency.currencyCode, this.totalPrice)}`;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get dueDate(): string {
    return this._dueDate;
  }

  get isOverDue(): boolean {
    return DateUtils.isBefore(this._dueDate);
  }

  get canDelete(): boolean {
    return this._canDelete;
  }

  get canAddReminder(): boolean {
    return this._canAddReminder;
  }
}
