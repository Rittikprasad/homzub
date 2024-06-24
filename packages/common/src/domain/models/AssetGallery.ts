import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('AssetGallery')
export class AssetGallery {
  @JsonProperty('id', Number, true)
  private _id = null;

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('is_cover_image', Boolean)
  private _isCoverImage = false;

  @JsonProperty('asset', Number)
  private _asset = 0;

  @JsonProperty('attachment', Number)
  private _attachment = 0;

  @JsonProperty('link', String)
  private _link = '';

  @JsonProperty('file_name', String)
  private _fileName = '';

  @JsonProperty('isLocalImage', Boolean, true)
  private _isLocalImage = false;

  get id(): number | null {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  get isCoverImage(): boolean {
    return this._isCoverImage;
  }

  set isCoverImage(value: boolean) {
    this._isCoverImage = value;
  }

  get asset(): number {
    return this._asset;
  }

  get attachment(): number {
    return this._attachment;
  }

  get link(): string {
    return this._link;
  }

  get fileName(): string {
    return this._fileName;
  }

  get isLocalImage(): boolean {
    return this._isLocalImage;
  }

  set isLocalImage(value: boolean) {
    this._isLocalImage = value;
  }
}
