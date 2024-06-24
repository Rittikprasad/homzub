import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Links, ILinks } from '@homzhub/common/src/domain/models/PaginationLinks';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

export interface IAssetAdvertisement {
  count: number;
  links: ILinks;
  results: IAssetAdvertisementResults[];
}

export interface IAssetAdvertisementResults {
  id: number;
  title: string;
  description: string;
  link: string;
  total_visits: number;
  expire_date: string;
  attachment: number;
}

@JsonObject('AssetAdvertisementResults')
export class AssetAdvertisementResults {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('link', String)
  private _link = '';

  @JsonProperty('attachment', Attachment)
  private _attachment = new Attachment();

  get id(): number {
    return this._id;
  }

  get link(): string {
    return this._link;
  }

  get attachment(): Attachment {
    return this._attachment;
  }
}

@JsonObject('AssetAdvertisement')
export class AssetAdvertisement {
  @JsonProperty('count', Number)
  private _count = 0;

  @JsonProperty('links', Links)
  private _links: Links = new Links();

  @JsonProperty('results', [AssetAdvertisementResults])
  private _results: AssetAdvertisementResults[] = [];

  get count(): number {
    return this._count;
  }

  get links(): Links {
    return this._links;
  }

  get results(): AssetAdvertisementResults[] {
    return this._results;
  }
}
