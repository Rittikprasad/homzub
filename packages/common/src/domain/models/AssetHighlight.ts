import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IAssetHighlight {
  name: string;
  covered: boolean;
}

@JsonObject('AssetHighlight')
export class AssetHighlight {
  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('covered', Boolean)
  private _covered = false;

  get name(): string {
    return this._name;
  }

  get covered(): boolean {
    return this._covered;
  }
}
