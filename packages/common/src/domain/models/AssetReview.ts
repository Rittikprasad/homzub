import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetReviewComment } from '@homzhub/common/src/domain/models/AssetReviewComment';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { User, IUser } from '@homzhub/common/src/domain/models/User';

export interface IAssetReview {
  id: number;
  rating: number;
  max_rating: number;
  lease_listing: number | null;
  sale_listing: number | null;
  description: string;
  is_reported: boolean;
  posted_at: string;
  reviewed_by: IUser;
}
const MAX_RATING = 5;

@JsonObject('AssetReview')
export class AssetReview {
  @JsonProperty('id', Number, true)
  private _id = 0;

  @JsonProperty('rating', Number, true)
  private _rating = 0;

  @JsonProperty('max_rating', Number, true)
  private _maxRating: number = MAX_RATING;

  @JsonProperty('lease_listing', Number, true)
  private _leaseListing: number | null = null;

  @JsonProperty('sale_listing', Number, true)
  private _saleListing: number | null = null;

  @JsonProperty('description', String, true)
  private _description = '';

  @JsonProperty('is_reported', Boolean, true)
  private _isReported = false;

  @JsonProperty('posted_at', String, true)
  private _postedAt = '';

  @JsonProperty('modified_at', String, true)
  private _modifiedAt = '';

  @JsonProperty('reviewed_by', User, true)
  private _reviewedBy = new User();

  @JsonProperty('comments', [AssetReviewComment], true)
  private _comments: AssetReviewComment[] = [];

  @JsonProperty('pillar_ratings', [Pillar], true)
  private _pillarRatings = [];

  @JsonProperty('review_count', Number, true)
  private _reviewCount = 0;

  @JsonProperty('review_report_id', Number, true)
  private _reviewReportId = 0;

  get reviewCount(): number {
    return this._reviewCount;
  }

  get id(): number {
    return this._id;
  }

  get rating(): number {
    return this._rating;
  }

  get maxRating(): number {
    return this._maxRating;
  }

  get leaseListing(): number | null {
    return this._leaseListing;
  }

  get saleListing(): number | null {
    return this._saleListing;
  }

  get description(): string {
    return this._description;
  }

  get isReported(): boolean {
    return this._isReported;
  }

  get postedAt(): string {
    return this._postedAt;
  }

  get reviewedBy(): User {
    return this._reviewedBy;
  }

  get comments(): AssetReviewComment[] {
    return this._comments;
  }

  set comments(comments: AssetReviewComment[]) {
    this._comments = comments;
  }

  get pillarRatings(): Pillar[] {
    return this._pillarRatings;
  }

  get modifiedAt(): string {
    return this._modifiedAt;
  }

  get reviewReportId(): number {
    return this._reviewReportId;
  }
}
