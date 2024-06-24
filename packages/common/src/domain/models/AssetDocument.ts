import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { User } from '@homzhub/common/src/domain/models/User';

@JsonObject('AssetDocument')
export class AssetDocument {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('asset', Number, true)
  private _asset = 0;

  @JsonProperty('description', String, true)
  private _description = '';

  @JsonProperty('uploaded_on', String)
  private _uploadedOn = '';

  @JsonProperty('attachment', Attachment)
  private _attachment: Attachment = new Attachment();

  @JsonProperty('user', User, true)
  private _user: User | null = null;

  @JsonProperty('lease_listing_id', Number, true)
  private _leaseListingId: number | null = null;

  @JsonProperty('sale_listing_id', Number, true)
  private _saleListingId: number | null = null;

  @JsonProperty('can_delete', Boolean, true)
  private _canDelete = false;

  @JsonProperty('is_system_generated', Boolean, true)
  private _isSystemGenerated = false;

  get id(): number {
    return this._id;
  }

  get asset(): number {
    return this._asset;
  }

  get description(): string {
    return this._description;
  }

  get uploadedOn(): string {
    return this._uploadedOn;
  }

  get attachment(): Attachment {
    return this._attachment;
  }

  get user(): User | null {
    return this._user;
  }

  get leaseListingId(): number | null {
    return this._leaseListingId;
  }

  get saleListingId(): number | null {
    return this._saleListingId;
  }

  get canDelete(): boolean {
    return this._canDelete;
  }

  get isSystemGenerated(): boolean {
    return this._isSystemGenerated;
  }
}
