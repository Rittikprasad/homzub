import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ISpaceInspection, SpaceInspection } from '@homzhub/common/src/domain/models/SpaceInspection';

export interface ISpaceUnitDetail {
  id: number;
  name: string;
  icon_url: string;
  is_completed: boolean;
  space_inspection: ISpaceInspection | null;
}

@JsonObject('SpaceUnitDetail')
export class SpaceUnitDetail {
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
}
