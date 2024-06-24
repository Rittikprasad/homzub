import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ISocialAuthProvider {
  provider: string;
  description: string;
  visible: boolean;
}

@JsonObject('SocialAuthProvider')
export class SocialAuthProvider {
  @JsonProperty('provider', String)
  private _provider = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('visible', Boolean)
  private _visible = false;

  get provider(): string {
    return this._provider;
  }

  get description(): string {
    return this._description;
  }

  get visible(): boolean {
    return this._visible;
  }
}
