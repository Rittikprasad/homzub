import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { ISpaceDetail, SpaceDetail } from '@homzhub/common/src/domain/models/SpaceDetail';

export interface IInspectionFinalReport {
  inspection_report_spaces: ISpaceDetail[];
}

@JsonObject('InspectionFinalReport')
export class InspectionFinalReport {
  @JsonProperty('inspection_report_spaces', [SpaceDetail])
  private _inspectionReportSpaces = [];

  get inspectionReportSpaces(): SpaceDetail[] {
    return this._inspectionReportSpaces;
  }
}
