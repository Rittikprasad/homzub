import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IDeepLink {
  deep_link: string;
}

@JsonObject('DeepLink')
export class DeepLink {
  @JsonProperty('deep_link', String)
  private _deepLink = '';

  get deepLink(): string {
    return this._deepLink;
  }
}
