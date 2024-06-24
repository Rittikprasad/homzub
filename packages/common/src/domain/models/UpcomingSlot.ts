import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('UpcomingSlot')
export class UpcomingSlot {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('visit_type', String)
  private _visit_type = '';

  @JsonProperty('start_date', String)
  private _start_date = '';

  @JsonProperty('end_date', String)
  private _end_date = '';

  get id(): number {
    return this._id;
  }

  get visit_type(): string {
    return this._visit_type;
  }

  get start_date(): string {
    return this._start_date;
  }

  get end_date(): string {
    return this._end_date;
  }
}
