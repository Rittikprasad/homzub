import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { PaymentPreFill } from '@homzhub/common/src/domain/models/PaymentPreFill';

@JsonObject('PaymentNote')
export class PaymentNote extends PaymentPreFill {
  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('user_invoice_no', String, true)
  private _userInvoiceNo = '';

  get description(): string {
    return this._description;
  }

  get userInvoiceNo(): string {
    return this._userInvoiceNo;
  }
}
