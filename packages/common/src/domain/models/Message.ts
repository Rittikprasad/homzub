import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Links } from '@homzhub/common/src/domain/models/Links';
import { User } from '@homzhub/common/src/domain/models/User';

export interface IMessageKeyValue {
  [key: string]: Message[];
}

export interface IMessages {
  count: number | null;
  links: Links;
  messageResult: IMessageKeyValue;
}

@JsonObject('Message')
export class Message {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('message', String)
  private _message = '';

  @JsonProperty('created_at', String, true)
  private _createdAt = '';

  @JsonProperty('user', User)
  private _user = new User();

  @JsonProperty('attachments', [Attachment], true)
  private _attachments = [];

  get id(): number {
    return this._id;
  }

  get message(): string {
    return this._message;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get user(): User {
    return this._user;
  }

  get attachments(): Attachment[] {
    return this._attachments;
  }
}

@JsonObject('Messages')
export class Messages {
  @JsonProperty('count', Number, true)
  private _count = null;

  @JsonProperty('links', Links)
  private _links = new Links();

  @JsonProperty('results', [Message])
  private _results = [];

  get count(): number | null {
    return this._count;
  }

  get links(): Links {
    return this._links;
  }

  get results(): Message[] {
    return this._results;
  }
}
