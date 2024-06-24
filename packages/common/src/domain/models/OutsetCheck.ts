import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('OutsetCheck')
export class OutsetCheck {
  @JsonProperty('can_start_inspection', Boolean)
  private _canStartInspection = false;

  @JsonProperty('user_asset_distance_km', Number)
  private _userAssetDistanceKm = 0;

  get canStartInspection(): boolean {
    return this._canStartInspection;
  }

  get userAssetDistanceKm(): number {
    return this._userAssetDistanceKm;
  }
}
