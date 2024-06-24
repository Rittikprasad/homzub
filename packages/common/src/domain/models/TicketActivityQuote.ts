import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { QuoteGroup } from '@homzhub/common/src/domain/models/QuoteGroup';
import { QuoteCategory } from '@homzhub/common/src/domain/models/QuoteCategory';
import { Quote } from '@homzhub/common/src/domain/models/Quote';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('TicketActivityQuote')
export class TicketActivityQuote extends Quote {
  @JsonProperty('quote_request_category', QuoteCategory, true)
  private _quoteRequestCategory = new QuoteCategory();

  @JsonProperty('quote_submit_group', QuoteGroup, true)
  private _quoteSubmitGroup = new QuoteGroup();

  @JsonProperty('user', User)
  private _user = new User();

  @JsonProperty('role', String, true)
  private _role = '';

  get quoteRequestCategory(): QuoteCategory {
    return this._quoteRequestCategory;
  }

  get quoteSubmitGroup(): QuoteGroup {
    return this._quoteSubmitGroup;
  }

  get user(): User {
    return this._user;
  }

  get role(): string {
    return this._role;
  }
}
