import { IAssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { IFeedback } from '@homzhub/common/src/domain/models/Feedback';
import { IFFMTicket } from '@homzhub/common/src/domain/models/FFMTicket';
import { IFFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { IInspectionReport } from '@homzhub/common/src/domain/models/InspectionReport';
import { IOnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Report } from '@homzhub/common/src/domain/models/Report';
import { IReportSpace } from '@homzhub/common/src/domain/models/ReportSpace';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { IWorkLocation } from '@homzhub/common/src/domain/repositories/interfaces';

export interface IFFMState {
  onBoardingData: IOnBoarding[];
  roles: IUnit[];
  reasons: IUnit[];
  selectedRole: Unit | null;
  workLocations: IWorkLocation[];
  visits: IFFMVisit[];
  visitDetail: IFFMVisit | null;
  feedback: IFeedback | null;
  inspectionReport: IInspectionReport | null;
  currentReport: Report | null;
  reportSpace: IReportSpace[];
  reportSpaceData: ILocalSpaceUpdatePayload;
  isFromDeeplink: boolean;
  hotProperties: IAssetSearch | null;
  tickets: IFFMTicket | null;
  loaders: {
    onBoarding: boolean;
    roles: boolean;
    visits: boolean;
    visitDetail: boolean;
    reasons: boolean;
    feedback: boolean;
    inspectionReport: boolean;
    reportSpace: boolean;
    spaceDetail: boolean;
    hotProperties: boolean;
    tickets: boolean;
  };
}

export interface ISpaceAttachment {
  id: number;
  attachmentUrl: string;
}

export interface ILocalSpaceUnitPayload {
  id?: number | null;
  name?: string;
  condition_of_space?: number;
  attachments?: ISpaceAttachment[];
  comments?: string;
}

export interface ILocalSpaceUpdatePayload {
  condition_of_space?: number;
  attachments?: ISpaceAttachment[];
  comments?: string;
  space_inspection_units?: ILocalSpaceUnitPayload[];
}
