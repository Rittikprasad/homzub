import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IPaymentTransaction, PaymentTransaction } from '@homzhub/common/src/domain/models/PaymentTransaction';
import { IReminder, Reminder } from '@homzhub/common/src/domain/models/Reminder';

export interface ISocietyReminder {
  last_payment_transaction: IPaymentTransaction | null;
  reminders: IReminder;
}

@JsonObject('SocietyReminder')
export class SocietyReminder {
  @JsonProperty('last_payment_transaction', PaymentTransaction, true)
  private _lastPaymentTransaction = null;

  @JsonProperty('reminders', [Reminder])
  private _reminders = [];

  get lastPaymentTransaction(): PaymentTransaction | null {
    return this._lastPaymentTransaction;
  }

  get reminders(): Reminder[] {
    return this._reminders;
  }
}
