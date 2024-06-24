import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUserQuote, UserQuote } from '@homzhub/common/src/domain/models/UserQuote';

export interface IRequestedQuote {
  id: number;
  name: string;
  users: IUserQuote[];
}

@JsonObject('RequestedQuote')
export class RequestedQuote {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('users', [UserQuote])
  private _users = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get users(): UserQuote[] {
    return this._users;
  }
}
