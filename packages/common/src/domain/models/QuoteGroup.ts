import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Comment, IComment } from '@homzhub/common/src/domain/models/Comment';
import { IUser, User } from '@homzhub/common/src/domain/models/User';
import { IQuote, Quote } from '@homzhub/common/src/domain/models/Quote';

export interface IQuoteGroup {
  id: number;
  user: IUser;
  role?: string;
  comment?: IComment;
  quotes?: IQuote[];
}

@JsonObject('QuoteGroup')
export class QuoteGroup {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('user', User)
  private _user = new User();

  @JsonProperty('role', String, true)
  private _role = '';

  @JsonProperty('comment', Comment, true)
  private _comment = new Comment();

  @JsonProperty('quotes', [Quote], true)
  private _quotes = [];

  get id(): number {
    return this._id;
  }

  get user(): User {
    return this._user;
  }

  get role(): string {
    return this._role;
  }

  get comment(): Comment {
    return this._comment;
  }

  get quotes(): Quote[] {
    return this._quotes;
  }
}
