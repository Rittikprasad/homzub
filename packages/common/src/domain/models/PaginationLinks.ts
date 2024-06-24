import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ILinks {
  next: string | null;
  previous: string | null;
}

@JsonObject('Links1')
export class Links {
  @JsonProperty('next', String, true)
  private _next = '';

  @JsonProperty('previous', String, true)
  private _previous = '';

  get next(): string {
    return this._next;
  }

  get previous(): string {
    return this._previous;
  }
}
