import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('AssetReviewComment')
export class AssetReviewComment {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('comment', String)
  private _comment = '';

  @JsonProperty('commented_by', User)
  private _commentedBy = new User();

  @JsonProperty('posted_at', String)
  private _postedAt = '';

  @JsonProperty('can_edit', Boolean)
  private _canEdit = false;

  @JsonProperty('can_delete', Boolean)
  private _canDelete = false;

  @JsonProperty('modified_at', String)
  private _modifiedAt = '';

  get id(): number {
    return this._id;
  }

  get postedAt(): string {
    return this._postedAt;
  }

  get commentedBy(): User {
    return this._commentedBy;
  }

  get comment(): string {
    return this._comment;
  }

  set comment(comment: string) {
    this._comment = comment;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  get canDelete(): boolean {
    return this._canDelete;
  }

  get modifiedAt(): string {
    return this._modifiedAt;
  }
}
