import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { LeaseSpaceUnit, ILeaseSpaceUnit } from '@homzhub/common/src/domain/models/LeaseSpaceUnit';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface ILeaseUnit extends IUnit {
  spaces: ILeaseSpaceUnit;
}

@JsonObject('LeaseUnit')
export class LeaseUnit extends Unit {
  @JsonProperty('spaces', [LeaseSpaceUnit], true)
  private _spaces = [];

  get spaces(): LeaseSpaceUnit[] {
    return this._spaces;
  }
}
