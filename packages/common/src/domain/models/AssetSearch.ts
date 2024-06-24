import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IProperties } from '@homzhub/common/src/domain/models/Search';
import { Links, ILinks } from '@homzhub/common/src/domain/models/PaginationLinks';

export interface IAssetSearch {
  count: number;
  links: ILinks;
  results: IProperties[];
}

@JsonObject('AssetSearch')
export class AssetSearch {
  @JsonProperty('count', Number, true)
  private _count = null;

  @JsonProperty('links', Links)
  private _links: Links = new Links();

  @JsonProperty('results', [Asset])
  private _results: Asset[] = [];

  get count(): number | null {
    return this._count;
  }

  get links(): Links {
    return this._links;
  }

  get results(): Asset[] {
    return this._results;
  }
}
