import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ISpaceInspection, SpaceInspection } from '@homzhub/common/src/domain/models/SpaceInspection';
import { ISpaceUnitDetail, SpaceUnitDetail } from '@homzhub/common/src/domain/models/SpaceUnitDetail';

export interface ISpaceDetail {
  id: number;
  name: string;
  icon_url: string;
  is_completed: boolean;
  space_inspection: ISpaceInspection | null;
  report_space_units: ISpaceUnitDetail[];
}

@JsonObject('SpaceDetail')
export class SpaceDetail {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('icon_url', String)
  private _iconUrl = '';

  @JsonProperty('is_completed', Boolean)
  private _isCompleted = false;

  @JsonProperty('space_inspection', SpaceInspection, true)
  private _spaceInspection = null;

  @JsonProperty('report_space_units', [SpaceUnitDetail], true)
  private _reportSpaceUnits = [];

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get iconUrl(): string {
    return this._iconUrl;
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get spaceInspection(): SpaceInspection | null {
    return this._spaceInspection;
  }

  get reportSpaceUnits(): SpaceUnitDetail[] {
    return this._reportSpaceUnits;
  }
}
