import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { Links } from '@homzhub/common/src/domain/models/Links';

@JsonObject('Media')
export class Media {
  @JsonProperty('count', Number, true)
  private _count = 0;

  @JsonProperty('links', Links)
  private _links = new Links();

  @JsonProperty('results', [Attachment])
  private _results = [];

  get count(): number {
    return this._count;
  }

  get links(): Links {
    return this._links;
  }

  get results(): Attachment[] {
    return this._results;
  }
}
