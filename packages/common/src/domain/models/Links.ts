import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

@JsonObject('Links')
export class Links {
  @JsonProperty('next', String, true)
  private _next = null;

  @JsonProperty('previous', String, true)
  private _previous = null;

  get next(): string | null {
    return this._next;
  }

  get previous(): string | null {
    return this._previous;
  }
}
