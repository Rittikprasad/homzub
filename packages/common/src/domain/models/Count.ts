import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';

export interface ICount {
  count: number;
}

@JsonObject('Count')
export class Count {
  @JsonProperty('count', Number)
  private _count = 0;

  get count(): number {
    return this._count;
  }
}
