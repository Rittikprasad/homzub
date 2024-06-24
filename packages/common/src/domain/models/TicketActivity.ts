import { JsonObject, JsonProperty } from 'json2typescript';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { User } from '@homzhub/common/src/domain/models/User';
import { TicketActivityData } from '@homzhub/common/src/domain/models/TicketActivityData';

@JsonObject('TicketActivity')
export class TicketActivity {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('activity_type', Unit)
  private activity_type = new Unit();

  @JsonProperty('created_at', String)
  private _createdAt = '';

  @JsonProperty('updated_at', String, true)
  private _updatedAt = '';

  @JsonProperty('user', User)
  private _user = new User();

  @JsonProperty('role', String, true)
  private _role = null;

  @JsonProperty('comment', String)
  private _comment = '';

  @JsonProperty('data', TicketActivityData, true)
  private _data = null;

  get id(): number {
    return this._id;
  }

  get activityType(): Unit {
    return this.activity_type;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  get user(): User {
    return this._user;
  }

  get role(): string {
    return StringUtils.toTitleCase(this._role ?? '');
  }

  get comment(): string {
    return this._comment;
  }

  get data(): TicketActivityData | null {
    return this._data;
  }
}
