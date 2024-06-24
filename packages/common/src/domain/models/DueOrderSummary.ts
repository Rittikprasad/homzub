import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';
import { JsonObject, JsonProperty, ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { theme } from '@homzhub/common/src/styles/theme';
import { flags } from '@homzhub/common/src/components/atoms/Flag';
import { Asset, IAsset, IListData } from '@homzhub/common/src/domain/models/Asset';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { InvoiceItem } from '@homzhub/common/src/domain/models/InvoiceItem';
import { OrderTotalSummary, ITax, Promo, Tax, Coins } from '@homzhub/common/src/domain/models/OrderSummary';
import { Payment } from '@homzhub/common/src/domain/models/Payment';

export enum DueOrderSummaryAction {
  REFRESH_INVOICE_AMOUNT = 'REFRESH_INVOICE_AMOUNT',
  TRIGGER_PAYMENT = 'TRIGGER_PAYMENT',
}

export interface IDueOrderSummary {
  id: number;
  due_title: string;
  invoice_no: string;
  invoice_title: string;
  due_date: string;
  total_price: number;
  total_base_price: number;
  total_tax: number;
  total_price_payable: number;
  sub_total: number;
  currency: ICurrency;
  asset: IAsset | null;
  total_discount: number | null;
  taxes: ITax[];
  is_coins_allowed?: boolean;
  is_promo_code_allowed?: boolean;
}

// Todo : see if we can club this with OrderSummary and make it generalised

@JsonObject('DueOrderSummary')
export class DueOrderSummary {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('due_title', String)
  private _dueTitle = '';

  @JsonProperty('invoice_no', String)
  private _invoiceNo = '';

  @JsonProperty('invoice_title', String)
  private _invoiceTitle = '';

  @JsonProperty('due_date', String)
  private _dueDate = '';

  @JsonProperty('total_price', Number)
  private _totalPrice = 0;

  @JsonProperty('total_base_price', Number)
  private _totalBasePrice = 0;

  @JsonProperty('total_tax', Number)
  private _totalTax = 0;

  @JsonProperty('total_price_payable', Number)
  private _totalPricePayable = 0;

  @JsonProperty('sub_total', Number)
  private _subTotal = 0;

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('asset', Asset)
  private _asset = null;

  @JsonProperty('total_discount', Number, true)
  private _totalDiscount = null;

  @JsonProperty('user_invoice_items', [InvoiceItem])
  private _userInvoiceItems = [];

  @JsonProperty('taxes', [Tax])
  private _taxes = [];

  @JsonProperty('coins', Coins, true)
  private _coins = null;

  @JsonProperty('promo', Promo, true)
  private _promo = null;

  @JsonProperty('order', Payment, true)
  private _order = null;

  @JsonProperty('is_coins_allowed', Boolean, true)
  private _isCoinsAllowed = false;

  @JsonProperty('is_promo_code_allowed', Boolean, true)
  private _isPromoCodeAllowed = false;

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

  get dueDate(): string {
    return this._dueDate;
  }

  get totalPrice(): number {
    return this._totalPrice;
  }

  get totalTax(): number {
    return this._totalTax;
  }

  get totalPriceFormatted(): string {
    return `${this.currency.currencySymbol}${CurrencyUtils.getCurrency(this.currency.currencyCode, this.totalPrice)}`;
  }

  get totalBasePrice(): number {
    return this._totalBasePrice;
  }

  get totalBasePriceFormatted(): string {
    return `${this.currency.currencySymbol}${CurrencyUtils.getCurrency(
      this.currency.currencyCode,
      this.totalBasePrice
    )}`;
  }

  get totalPricePayable(): number {
    return this._totalPricePayable;
  }

  get totalPricePayableFormatted(): OrderTotalSummary {
    return new OrderTotalSummary('You pay', this.totalPricePayable);
  }

  get subTotal(): number {
    return this._subTotal;
  }

  get subTotalFormatted(): string {
    return `${this.currency.currencySymbol}${CurrencyUtils.getCurrency(this.currency.currencyCode, this.subTotal)}`;
  }

  get currency(): Currency {
    return this._currency;
  }

  get asset(): Asset | null {
    return this._asset;
  }

  get totalDiscount(): number | null {
    return this._totalDiscount;
  }

  get userInvoiceItems(): InvoiceItem[] {
    return this._userInvoiceItems;
  }

  get userInvoiceItemsFormatted(): IListData[] {
    // Todo (Praharsh) : Add translation if needed.
    const header = {
      label: 'Items',
      value: 'Amount',
      isTitle: true,
    };
    if (!this.userInvoiceItems.length) {
      const invoiceFormatted = {
        label: this.invoiceTitle,
        value: this.totalBasePriceFormatted,
      };
      return [header, invoiceFormatted];
    }
    const lineItemsFormatted = this.userInvoiceItems.map((i) => ({
      label: i.itemName,
      value: `${this.currency.currencySymbol}${CurrencyUtils.getCurrency(this.currency.currencyCode, i.posPrice)}`,
      isTitle: false,
    }));
    return [header, ...lineItemsFormatted];
  }

  get taxes(): Tax[] {
    return this._taxes;
  }

  get coins(): Coins | null {
    return this._coins;
  }

  get promo(): Promo | null {
    return this._promo;
  }

  get order(): Payment | null {
    return this._order;
  }

  get subTotalSummarised(): OrderTotalSummary {
    return new OrderTotalSummary('Sub Total', this._subTotal);
  }

  get discountSummarised(): OrderTotalSummary {
    const getDiscount = (): number => {
      if (this.totalDiscount && this.totalDiscount > 0) {
        return Math.abs(this.totalDiscount);
      }
      return 0;
    };
    return new OrderTotalSummary('Discount', getDiscount(), theme.colors.green);
  }

  get dueOrderSummaryList(): OrderTotalSummary[] {
    const summaryList: OrderTotalSummary[] = [];

    if (this.totalDiscount && this.totalDiscount > 0) {
      summaryList.push(this.discountSummarised);
    }

    summaryList.push(this.subTotalSummarised);

    this.taxes.forEach((tax) => {
      if (tax.taxAmount > 0) {
        const title = `${tax.taxLabel}(${tax.taxPercentage}%)`;
        const taxData = new OrderTotalSummary(title, tax.taxAmount);
        summaryList.push(taxData);
      }
    });

    return summaryList;
  }

  get countryFlag(): React.ReactElement {
    if (this.asset) return this.asset.country.flag;
    const {
      common: { countries },
    } = StoreProviderService.getStore().getState();
    const countriesDeserialised = ObjectMapper.deserializeArray(Country, countries);
    const dueCurrency = countriesDeserialised.find((item) =>
      item.currencies.find((i) => i.currencyCode === this.currency.currencyCode)
    );
    // @ts-ignore
    return flags[dueCurrency?.iso2Code ?? ''];
  }

  get isCoinsAllowed(): boolean {
    return this._isCoinsAllowed;
  }

  get isPromoCodeAllowed(): boolean {
    return this._isPromoCodeAllowed;
  }
}
