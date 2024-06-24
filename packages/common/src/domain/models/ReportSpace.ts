import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface IReportSpace {
  id: number;
  name: string;
  icon_url: string;
  is_completed: boolean;
}

@JsonObject('ReportSpace')
export class ReportSpace {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('icon_url', String)
  private _iconUrl = '';

  @JsonProperty('is_completed', Boolean)
  private _isCompleted = false;

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
}
