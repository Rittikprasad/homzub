import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ILinks, Links } from '@homzhub/common/src/domain/models/PaginationLinks';
import { IReport, Report } from '@homzhub/common/src/domain/models/Report';

export interface IInspectionReport {
  count: number | null;
  links: ILinks;
  results: IReport[];
}

@JsonObject('InspectionReport')
export class InspectionReport {
  @JsonProperty('count', Number, true)
  private _count = null;

  @JsonProperty('links', Links)
  private _links = new Links();

  @JsonProperty('results', [Report])
  private _results = [];

  get count(): number | null {
    return this._count;
  }

  get links(): Links {
    return this._links;
  }

  get results(): Report[] {
    return this._results;
  }
}
