import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IQuote, Quote } from '@homzhub/common/src/domain/models/Quote';
import { IUser, User } from '@homzhub/common/src/domain/models/User';

export interface IUserQuote extends IUser {
  quotes: IQuote[];
  role: string;
}

@JsonObject('UserQuote')
export class UserQuote extends User {
  @JsonProperty('quotes', [Quote])
  private _quotes = [];

  @JsonProperty('role', String)
  private _role = '';

  get quotes(): Quote[] {
    return this._quotes;
  }

  get role(): string {
    return this._role;
  }
}
