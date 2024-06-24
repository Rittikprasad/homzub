import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IQuote, Quote } from '@homzhub/common/src/domain/models/Quote';
import { QuoteGroup, IQuoteGroup } from '@homzhub/common/src/domain/models/QuoteGroup';

export interface IQuoteCategory {
  id: number;
  name?: string;
  quotes?: IQuote;
  title: string;
  quote_submit_group?: IQuoteGroup;
  quote_submit_groups?: IQuoteGroup[];
}

@JsonObject('QuoteCategory')
export class QuoteCategory {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String, true)
  private _name = '';

  @JsonProperty('quotes', [Quote], true)
  private _quotes = [];

  @JsonProperty('quote_submit_group', QuoteGroup, true)
  private _quoteSubmitGroup = new QuoteGroup();

  @JsonProperty('title', String, true)
  private _title = '';

  @JsonProperty('quote_submit_groups', [QuoteGroup], true)
  private _quoteSubmitGroups = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get title(): string {
    return this._title;
  }

  get quoteSubmitGroups(): QuoteGroup[] {
    return this._quoteSubmitGroups;
  }

  get quotes(): Quote[] {
    return this._quotes;
  }

  get quoteSubmitGroup(): QuoteGroup {
    return this._quoteSubmitGroup;
  }
}
