import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface ICarpetArea extends IUnit {
  max_area: number;
  min_area: number;
}

@JsonObject('CarpetArea')
export class CarpetArea extends Unit {
  @JsonProperty('max_area', Number, true)
  private _maxArea = 0;

  @JsonProperty('min_area', Number, true)
  private _minArea = 0;

  get maxArea(): number {
    return this._maxArea;
  }

  get minArea(): number {
    return this._minArea;
  }
}
