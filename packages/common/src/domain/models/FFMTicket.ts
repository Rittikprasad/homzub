import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { Links, ILinks } from '@homzhub/common/src/domain/models/PaginationLinks';
import { ITicket, Ticket } from '@homzhub/common/src/domain/models/Ticket';

export interface IFFMTicket {
  count: number;
  links: ILinks;
  results: ITicket[];
}

@JsonObject('FFMTicket')
export class FFMTicket {
  @JsonProperty('count', Number, true)
  private _count = null;

  @JsonProperty('links', Links)
  private _links: Links = new Links();

  @JsonProperty('results', [Ticket])
  private _results: Ticket[] = [];

  get count(): number | null {
    return this._count;
  }

  get links(): Links {
    return this._links;
  }

  get results(): Ticket[] {
    return this._results;
  }
}
