import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';

export interface IInvoice {
  id: number;
  invoice_no: string;
  invoice_title: string;
  attachment: IAttachment;
}

@JsonObject('Invoice')
export class Invoice {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('invoice_no', String)
  private _invoiceNumber = '';

  @JsonProperty('invoice_title', String)
  private _invoiceTitle = '';

  @JsonProperty('attachment', Attachment, true)
  private _attachment = new Attachment();

  get id(): number {
    return this._id;
  }

  get invoiceNumber(): string {
    return this._invoiceNumber;
  }

  get invoiceTitle(): string {
    return this._invoiceTitle;
  }

  get attachment(): Attachment {
    return this._attachment;
  }
}
