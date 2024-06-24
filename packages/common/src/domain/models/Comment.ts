import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUser, User } from '@homzhub/common/src/domain/models/User';

export interface IComment {
  id: number;
  comment: string;
  commented_by: IUser;
  posted_at: string;
  modified_at: string;
  can_edit: boolean;
  can_delete: boolean;
}

@JsonObject('Comment')
export class Comment {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('comment', String)
  private _comment = '';

  @JsonProperty('commented_by', User)
  private _commentedBy = new User();

  @JsonProperty('posted_at', String)
  private _postedAt = '';

  @JsonProperty('modified_at', String)
  private _modifiedAt = '';

  @JsonProperty('can_edit', Boolean)
  private _canEdit = false;

  @JsonProperty('can_delete', Boolean)
  private _canDelete = false;

  get id(): number {
    return this._id;
  }

  get comment(): string {
    return this._comment;
  }

  get commentedBy(): User {
    return this._commentedBy;
  }

  get postedAt(): string {
    return this._postedAt;
  }

  get modifiedAt(): string {
    return this._modifiedAt;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  get canDelete(): boolean {
    return this._canDelete;
  }
}
