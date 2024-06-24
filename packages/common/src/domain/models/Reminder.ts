import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';
import { Unit, IUnit } from '@homzhub/common/src/domain/models/Unit';
import { IUser, User } from '@homzhub/common/src/domain/models/User';

export interface IReminder {
  id: number;
  title: string;
  description?: string;
  emails?: string[];
  reminder_category?: IUnit;
  reminder_frequency?: IUnit;
  asset?: IAsset;
  start_date?: string;
  can_edit?: boolean;
  can_delete?: boolean;
  amount: number | null;
  payer_user: IUser | null;
  receiver_user?: IUnit | null;
  user_bank_info?: number | null;
  currency?: ICurrency | null;
  next_reminder_date: string;
  can_pay?: boolean;
}

@JsonObject('Reminder')
export class Reminder {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('description', String, true)
  private _description = '';

  @JsonProperty('emails', [String], true)
  private _emails = [];

  @JsonProperty('reminder_category', Unit, true)
  private _reminderCategory = new Unit();

  @JsonProperty('reminder_frequency', Unit, true)
  private _reminderFrequency = new Unit();

  @JsonProperty('asset', Asset, true)
  private _asset = null;

  @JsonProperty('start_date', String, true)
  private _startDate = '';

  @JsonProperty('next_reminder_date', String)
  private _nextReminderDate = '';

  /*
   * 28-July-2021
   * Used Unit as a type because only Id is returning from BE.
   * If needed update lease_transaction model
   */
  @JsonProperty('lease_transaction', Unit, true)
  private _leaseTransaction = new Unit();

  @JsonProperty('can_edit', Boolean, true)
  private _canEdit = false;

  @JsonProperty('can_delete', Boolean, true)
  private _canDelete = false;

  @JsonProperty('amount', Number, true)
  private _amount = null;

  @JsonProperty('payer_user', User)
  private _payerUser = null;

  @JsonProperty('receiver_user', Unit, true)
  private _receiverUser = null;

  @JsonProperty('user_bank_info', Unit, true)
  private _userBankInfo = null;

  @JsonProperty('currency', Currency, true)
  private _currency = null;

  @JsonProperty('can_pay', Boolean, true)
  private _canPay = false;

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get emails(): string[] {
    return this._emails;
  }

  get reminderCategory(): Unit {
    return this._reminderCategory;
  }

  get reminderFrequency(): Unit {
    return this._reminderFrequency;
  }

  get asset(): Asset | null {
    return this._asset;
  }

  get startDate(): string {
    return this._startDate;
  }

  get nextReminderDate(): string {
    return this._nextReminderDate;
  }

  get leaseTransaction(): Unit {
    return this._leaseTransaction;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  get canDelete(): boolean {
    return this._canDelete;
  }

  get amount(): number | null {
    return this._amount;
  }

  get payerUser(): User | null {
    return this._payerUser;
  }

  get receiverUser(): Unit | null {
    return this._receiverUser;
  }

  get userBankInfo(): Unit | null {
    return this._userBankInfo;
  }

  get currency(): Currency | null {
    return this._currency;
  }

  get canPay(): boolean {
    return this._canPay;
  }
}
