import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { TicketActivityQuote } from '@homzhub/common/src/domain/models/TicketActivityQuote';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('TicketActivityData')
export class TicketActivityData {
  @JsonProperty('assigned_to', User, true)
  private _assignedTo = new User();

  @JsonProperty('quote_request_categories', [QuoteCategory], true)
  private _quoteRequestCategory = [];

  @JsonProperty('quotes', [TicketActivityQuote], true)
  private _quotes = [];

  @JsonProperty('attachments', [Attachment], true)
  private _attachments = [];

  @JsonProperty('title', String, true)
  private _title = '';

  get assignedTo(): User {
    return this._assignedTo;
  }

  get quoteRequestCategory(): QuoteCategory[] {
    return this._quoteRequestCategory;
  }

  get quotes(): TicketActivityQuote[] {
    return this._quotes;
  }

  get attachments(): Attachment[] {
    return this._attachments;
  }

  get title(): string {
    return this._title;
  }
}
