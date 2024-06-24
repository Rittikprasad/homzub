import moment from 'moment';
import { DateFormats } from '@homzhub/common/src/utils/DateUtils';
import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { ILabelColor, LabelColor } from '@homzhub/common/src/domain/models/LabelColor';

export interface ITransaction {
  label: string;
  currency_code?: string;
  currency_symbol?: string;
  amount: number;
  status: string;
}

@JsonObject('Transaction')
export class Transaction {
  @JsonProperty('label', String)
  private readonly _label: string = '';

  @JsonProperty('currency_code', String, true)
  private _currencyCode = '';

  @JsonProperty('currency_symbol', String, true)
  private _currencySymbol = '';

  @JsonProperty('amount', Number)
  private readonly _amount: number = 0;

  @JsonProperty('status', String)
  private _status = '';

  constructor(label: string, amount: number) {
    this._label = label;
    this._amount = amount;
  }

  get label(): string {
    return this._label;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  get currencySymbol(): string {
    return this._currencySymbol;
  }

  get amount(): number {
    return this._amount;
  }

  get status(): string {
    return this._status;
  }
}

export interface ILeasePeriod {
  id?: number;
  lease_start_date: string;
  lease_end_date: string;
  total_lease_period: string;
  remaining_lease_period: string;
  action: ILabelColor;
}

@JsonObject('LeasePeriod')
export class LeasePeriod {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('lease_start_date', String)
  private _leaseStartDate = '';

  @JsonProperty('lease_end_date', String)
  private _leaseEndDate = '';

  @JsonProperty('total_lease_period', String)
  private _totalLeasePeriod = '';

  @JsonProperty('remaining_lease_period', String)
  private _remainingLeasePeriod = '';

  @JsonProperty('action', LabelColor, true)
  private _action: LabelColor | null = null;

  get id(): number {
    return this._id;
  }

  get leaseStartDate(): string {
    return this._leaseStartDate ? moment(this._leaseStartDate, DateFormats.ISO).format('DD/MM/YYYY') : '';
  }

  get leaseEndDate(): string {
    return this._leaseEndDate ? moment(this._leaseEndDate, DateFormats.ISO).format('DD/MM/YYYY') : '';
  }

  get totalLeasePeriod(): string {
    return this._totalLeasePeriod.substr(0, this._totalLeasePeriod.indexOf(' '));
  }

  get remainingLeasePeriod(): string {
    return this._remainingLeasePeriod.substr(0, this._remainingLeasePeriod.indexOf(' '));
  }

  get action(): LabelColor | null {
    return this._action;
  }

  get totalSpendPeriod(): number {
    const newPeriod = Number(this.totalLeasePeriod) - Number(this.remainingLeasePeriod);
    return newPeriod / Number(this.totalLeasePeriod);
  }
}

interface ILeaseTransaction extends ILeasePeriod {
  currency?: ICurrency;
  rent: ITransaction;
  security_deposit: ITransaction;
  message_group_id: number;
}

@JsonObject('LeaseTransaction')
export class LeaseTransaction extends LeasePeriod {
  @JsonProperty('currency', Currency, true)
  private _currency = new Currency();

  @JsonProperty('rent', Transaction, true)
  private _rent: Transaction | null = null;

  @JsonProperty('security_deposit', Transaction, true)
  private _securityDeposit: Transaction | null = null;

  @JsonProperty('message_group_id', Number, true)
  private _messageGroupId = 0;

  get rent(): Transaction | null {
    return this._rent;
  }

  get securityDeposit(): Transaction | null {
    return this._securityDeposit;
  }

  get currency(): Currency {
    return this._currency;
  }

  get messageGroupId(): number {
    return this._messageGroupId;
  }
}
