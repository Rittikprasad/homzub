import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('PanNumber')
export class PanNumber {
  @JsonProperty('pan_number', String, true)
  private _panNumber = null;

  @JsonProperty('can_edit', Boolean)
  private _canEdit = true;

  get panNumber(): string {
    return this._panNumber ?? '';
  }

  get canEdit(): boolean {
    return this._canEdit;
  }
}
