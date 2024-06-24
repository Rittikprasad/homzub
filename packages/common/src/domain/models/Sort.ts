import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';

export interface ISort extends IUnit {
  ordering_column: string;
  default: boolean;
}

@JsonObject('Sort')
export class Sort extends Unit {
  @JsonProperty('ordering_column', String)
  private _orderingColumn = '';

  @JsonProperty('default', Boolean)
  private _default = false;

  get orderingColumn(): string {
    return this._orderingColumn;
  }

  get default(): boolean {
    return this._default;
  }
}
