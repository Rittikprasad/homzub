import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';

export interface IQuote {
  id: number;
  quote_number: number;
  total_amount: number;
  status: string;
  currency: ICurrency;
  attachment: IAttachment;
}

@JsonObject('Quote')
export class Quote {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('quote_number', Number)
  private _quoteNumber = 0;

  @JsonProperty('total_amount', Number)
  private _totalAmount = 0;

  @JsonProperty('status', String)
  private _status = '';

  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('attachment', Attachment)
  private _attachment = new Attachment();

  get id(): number {
    return this._id;
  }

  get quoteNumber(): number {
    return this._quoteNumber;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get status(): string {
    return this._status;
  }

  get currency(): Currency {
    return this._currency;
  }

  get attachment(): Attachment {
    return this._attachment;
  }
}
