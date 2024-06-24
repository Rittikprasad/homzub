import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('ReportReview')
export class ReportReview {
  @JsonProperty('reviewed_by', User)
  private _reviewedBy = new User();

  @JsonProperty('review_comment', String)
  private _reviewComment = '';

  @JsonProperty('reviewed_at', String)
  private _reviewedAt = '';

  @JsonProperty('reported_on', String)
  private _reportedOn = '';

  get reviewedBy(): User {
    return this._reviewedBy;
  }

  get reviewComment(): string {
    return this._reviewComment;
  }

  get reviewedAt(): string {
    return this._reviewedAt;
  }

  get reportedOn(): string {
    return this._reportedOn;
  }
}
