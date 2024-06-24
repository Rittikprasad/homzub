import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('AssetListingVisits')
export class AssetListingVisits {
  @JsonProperty('upcoming_visits', Number, true)
  private _upcomingVisits = 0;

  @JsonProperty('missed_visits', Number, true)
  private _missedVisits = 0;

  @JsonProperty('completed_visits', Number, true)
  private _completedVisits = 0;

  get upcomingVisits(): number {
    return this._upcomingVisits;
  }

  get missedVisits(): number {
    return this._missedVisits;
  }

  get completedVisits(): number {
    return this._completedVisits;
  }
}
