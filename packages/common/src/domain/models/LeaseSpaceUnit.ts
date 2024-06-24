import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ILeaseSpaceUnit {
  count: number;
  space_type: number;
}

@JsonObject('LeaseSpaceUnit')
export class LeaseSpaceUnit {
  @JsonProperty('count', Number, true)
  private _count = -1;

  @JsonProperty('space_type', Number, true)
  private _spaceType = -1;

  get count(): number {
    return this._count;
  }

  get spaceType(): number {
    return this._spaceType;
  }
}
