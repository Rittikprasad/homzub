import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IOnBoarding {
  title: string;
  description: string;
  image_url: string;
}

@JsonObject('OnBoarding')
export class OnBoarding {
  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('image_url', String)
  private _imageUrl = '';

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }
}
