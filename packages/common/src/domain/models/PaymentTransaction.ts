import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface IPaymentTransaction {
  id: number;
  expected_amount?: number;
  paid_amount?: number | null;
  balance_amount?: number;
  payment_type?: IUnit;
  payment_date?: string;
}

@JsonObject('PaymentTransaction')
export class PaymentTransaction {
  @JsonProperty('id', Number)
  private _id = -1;

  @JsonProperty('expected_amount', Number, true)
  private _expectedAmount = -1;

  @JsonProperty('paid_amount', Number, true)
  private _paidAmount = null;

  @JsonProperty('balance_amount', Number, true)
  private _balanceAmount = -1;

  @JsonProperty('payment_type', Unit, true)
  private _paymentType = new Unit();

  @JsonProperty('payment_date', String, true)
  private _paymentDate = '';

  get id(): number {
    return this._id;
  }

  get expectedAmount(): number {
    return this._expectedAmount;
  }

  get paid_amount(): number | null {
    return this._paidAmount;
  }

  get balance_amount(): number {
    return this._balanceAmount;
  }

  get paymentType(): Unit {
    return this._paymentType;
  }

  get paidAmount(): number | null {
    return this._paidAmount;
  }

  get balanceAmount(): number {
    return this._balanceAmount;
  }

  get paymentDate(): string {
    return this._paymentDate;
  }
}
