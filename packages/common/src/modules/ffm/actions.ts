import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetSearch, IAssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { Feedback, IFeedback } from '@homzhub/common/src/domain/models/Feedback';
import { FFMTicket, IFFMTicket } from '@homzhub/common/src/domain/models/FFMTicket';
import { FFMVisit, IFFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { IInspectionReport, InspectionReport } from '@homzhub/common/src/domain/models/InspectionReport';
import { IOnBoarding, OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Report } from '@homzhub/common/src/domain/models/Report';
import { IReportSpace, ReportSpace } from '@homzhub/common/src/domain/models/ReportSpace';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import {
  IFFMVisitParam,
  IGetFeedbackParam,
  IGetSpaceDetail,
  IGetTicket,
  IWorkLocation,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ILocalSpaceUpdatePayload } from '@homzhub/common/src/modules/ffm/interface';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

const actionTypePrefix = 'FFM/';
export const FFMActionTypes = {
  GET: {
    ONBOARDING: `${actionTypePrefix}ONBOARDING`,
    ONBOARDING_SUCCESS: `${actionTypePrefix}ONBOARDING_SUCCESS`,
    ONBOARDING_FAILURE: `${actionTypePrefix}ONBOARDING_FAILURE`,
    ROLES: `${actionTypePrefix}ROLES`,
    ROLES_SUCCESS: `${actionTypePrefix}ROLES_SUCCESS`,
    ROLES_FAILURE: `${actionTypePrefix}ROLES_FAILURE`,
    VISITS: `${actionTypePrefix}VISITS`,
    VISITS_SUCCESS: `${actionTypePrefix}VISITS_SUCCESS`,
    VISITS_FAILURE: `${actionTypePrefix}VISITS_FAILURE`,
    VISIT_DETAIL: `${actionTypePrefix}VISIT_DETAIL`,
    VISIT_DETAIL_SUCCESS: `${actionTypePrefix}VISIT_DETAIL_SUCCESS`,
    VISIT_DETAIL_FAILURE: `${actionTypePrefix}VISIT_DETAIL_FAILURE`,
    REJECTION_REASON: `${actionTypePrefix}REJECTION_REASON`,
    REJECTION_REASON_SUCCESS: `${actionTypePrefix}REJECTION_REASON_SUCCESS`,
    REJECTION_REASON_FAILURE: `${actionTypePrefix}REJECTION_REASON_FAILURE`,
    FEEDBACK: `${actionTypePrefix}FEEDBACK`,
    FEEDBACK_SUCCESS: `${actionTypePrefix}FEEDBACK_SUCCESS`,
    FEEDBACK_FAILURE: `${actionTypePrefix}FEEDBACK_FAILURE`,
    INSPECTION_REPORT: `${actionTypePrefix}INSPECTION_REPORT`,
    INSPECTION_REPORT_SUCCESS: `${actionTypePrefix}INSPECTION_REPORT_SUCCESS`,
    INSPECTION_REPORT_FAILURE: `${actionTypePrefix}INSPECTION_REPORT_FAILURE`,
    REPORT_SPACE: `${actionTypePrefix}REPORT_SPACE`,
    REPORT_SPACE_SUCCESS: `${actionTypePrefix}REPORT_SPACE_SUCCESS`,
    REPORT_SPACE_FAILURE: `${actionTypePrefix}REPORT_SPACE_FAILURE`,
    SPACE_DETAIL: `${actionTypePrefix}SPACE_DETAIL`,
    SPACE_DETAIL_SUCCESS: `${actionTypePrefix}SPACE_DETAIL_SUCCESS`,
    SPACE_DETAIL_FAILURE: `${actionTypePrefix}SPACE_DETAIL_FAILURE`,
    HOT_PROPERTIES: `${actionTypePrefix}HOT_PROPERTIES`,
    HOT_PROPERTIES_SUCCESS: `${actionTypePrefix}HOT_PROPERTIES_SUCCESS`,
    HOT_PROPERTIES_FAILURE: `${actionTypePrefix}HOT_PROPERTIES_FAILURE`,
    FFM_TICKETS: `${actionTypePrefix}FFM_TICKETS`,
    FFM_TICKETS_SUCCESS: `${actionTypePrefix}FFM_TICKETS_SUCCESS`,
    FFM_TICKETS_FAILURE: `${actionTypePrefix}FFM_TICKETS_FAILURE`,
    TICKET_DETAIL: `${actionTypePrefix}TICKET_DETAIL`,
    TICKET_ACTIONS: `${actionTypePrefix}TICKET_ACTIONS`,
  },
  SET: {
    SELECTED_ROLE: `${actionTypePrefix}SELECTED_ROLE`,
    WORK_LOCATION: `${actionTypePrefix}WORK_LOCATION`,
    CURRENT_REPORT: `${actionTypePrefix}CURRENT_REPORT`,
    REPORT_SPACE_DATA: `${actionTypePrefix}REPORT_SPACE_DATA`,
    DEEPLINK_DATA: `${actionTypePrefix}DEEPLINK_DATA`,
  },
  CLEAR: {
    FEEDBACK_DATA: `${actionTypePrefix}FEEDBACK_DATA`,
    SELECTED_REPORT: `${actionTypePrefix}SELECTED_REPORT`,
    SPACE_DATA: `${actionTypePrefix}SPACE_DATA`,
  },
};

const getOnBoardingData = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.ONBOARDING,
});

const getOnBoardingDataSuccess = (payload: OnBoarding[]): IFluxStandardAction<IOnBoarding[]> => ({
  type: FFMActionTypes.GET.ONBOARDING_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getOnBoardingDataFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.ONBOARDING_FAILURE,
});

const getRoles = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.ROLES,
});

const getRolesSuccess = (payload: Unit[]): IFluxStandardAction<IUnit[]> => ({
  type: FFMActionTypes.GET.ROLES_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getRolesFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.ROLES_FAILURE,
});

const setSelectedRole = (role: Unit): IFluxStandardAction<Unit> => ({
  type: FFMActionTypes.SET.SELECTED_ROLE,
  payload: role,
});

const setWorkLocations = (payload: IWorkLocation[]): IFluxStandardAction<IWorkLocation[]> => ({
  type: FFMActionTypes.SET.WORK_LOCATION,
  payload,
});

const getVisits = (payload?: IFFMVisitParam): IFluxStandardAction<IFFMVisitParam> => ({
  type: FFMActionTypes.GET.VISITS,
  payload,
});

const getVisitsSuccess = (payload: FFMVisit[]): IFluxStandardAction<IFFMVisit[]> => ({
  type: FFMActionTypes.GET.VISITS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getVisitsFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.VISITS_FAILURE,
});

const getVisitDetail = (visitId: number): IFluxStandardAction<number> => ({
  type: FFMActionTypes.GET.VISIT_DETAIL,
  payload: visitId,
});

const getVisitDetailSuccess = (payload: FFMVisit): IFluxStandardAction<IFFMVisit> => {
  return {
    type: FFMActionTypes.GET.VISIT_DETAIL_SUCCESS,
    payload: ObjectMapper.serialize(payload),
  };
};

const getVisitDetailFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.VISIT_DETAIL_FAILURE,
});

const getRejectionReasons = (payload: number): IFluxStandardAction<number> => ({
  type: FFMActionTypes.GET.REJECTION_REASON,
  payload,
});

const getRejectionReasonsSuccess = (payload: Unit[]): IFluxStandardAction<IUnit[]> => ({
  type: FFMActionTypes.GET.REJECTION_REASON_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getRejectionReasonsFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.REJECTION_REASON_FAILURE,
});

const getFeedback = (payload: IGetFeedbackParam): IFluxStandardAction<IGetFeedbackParam> => ({
  type: FFMActionTypes.GET.FEEDBACK,
  payload,
});

const getFeedbackSuccess = (payload: Feedback): IFluxStandardAction<IFeedback> => ({
  type: FFMActionTypes.GET.FEEDBACK_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getFeedbackFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.FEEDBACK_FAILURE,
});

const clearFeedbackData = (): IFluxStandardAction => ({
  type: FFMActionTypes.CLEAR.FEEDBACK_DATA,
});

const getInspectionReport = (payload: string): IFluxStandardAction<string> => ({
  type: FFMActionTypes.GET.INSPECTION_REPORT,
  payload,
});

const getInspectionReportSuccess = (payload: InspectionReport): IFluxStandardAction<IInspectionReport> => ({
  type: FFMActionTypes.GET.INSPECTION_REPORT_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getInspectionReportFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.INSPECTION_REPORT_FAILURE,
});

const setCurrentReport = (payload: Report): IFluxStandardAction<Report> => ({
  type: FFMActionTypes.SET.CURRENT_REPORT,
  payload,
});

const clearCurrentReport = (): IFluxStandardAction => ({
  type: FFMActionTypes.CLEAR.SELECTED_REPORT,
});

const getReportSpace = (payload: number): IFluxStandardAction<number> => ({
  type: FFMActionTypes.GET.REPORT_SPACE,
  payload,
});

const getReportSpaceSuccess = (payload: ReportSpace[]): IFluxStandardAction<IReportSpace[]> => ({
  type: FFMActionTypes.GET.REPORT_SPACE_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getReportSpaceFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.REPORT_SPACE_FAILURE,
});

const setReportSpaceData = (payload: ILocalSpaceUpdatePayload): IFluxStandardAction<ILocalSpaceUpdatePayload> => ({
  type: FFMActionTypes.SET.REPORT_SPACE_DATA,
  payload,
});

const clearSpaceData = (): IFluxStandardAction => ({
  type: FFMActionTypes.CLEAR.SPACE_DATA,
});

const getSpaceDetail = (payload: IGetSpaceDetail): IFluxStandardAction<IGetSpaceDetail> => ({
  type: FFMActionTypes.GET.SPACE_DETAIL,
  payload,
});

const getSpaceDetailSuccess = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.SPACE_DETAIL_SUCCESS,
});

const getSpaceDetailFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.SPACE_DETAIL_FAILURE,
});

const setDeeplinkData = (payload: boolean): IFluxStandardAction<boolean> => ({
  type: FFMActionTypes.SET.DEEPLINK_DATA,
  payload,
});

const getHotProperties = (payload: Tabs): IFluxStandardAction<Tabs> => ({
  type: FFMActionTypes.GET.HOT_PROPERTIES,
  payload,
});

const getHotPropertiesSuccess = (payload: AssetSearch): IFluxStandardAction<IAssetSearch> => ({
  type: FFMActionTypes.GET.HOT_PROPERTIES_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getHotPropertiesFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.HOT_PROPERTIES_FAILURE,
});

const getTickets = (payload: IGetTicket): IFluxStandardAction<IGetTicket> => ({
  type: FFMActionTypes.GET.FFM_TICKETS,
  payload,
});

const getTicketsSuccess = (payload: FFMTicket): IFluxStandardAction<IFFMTicket> => ({
  type: FFMActionTypes.GET.FFM_TICKETS_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getTicketsFailure = (): IFluxStandardAction => ({
  type: FFMActionTypes.GET.FFM_TICKETS_FAILURE,
});

const getTicketDetail = (payload: number): IFluxStandardAction<number> => ({
  type: FFMActionTypes.GET.TICKET_DETAIL,
  payload,
});

const getTicketActions = (payload: number): IFluxStandardAction<number> => ({
  type: FFMActionTypes.GET.TICKET_ACTIONS,
  payload,
});

export type FFMActionPayloadTypes =
  | string
  | number
  | boolean
  | IUnit[]
  | IOnBoarding[]
  | Unit
  | IWorkLocation[]
  | FFMVisit[]
  | IFFMVisit[]
  | IFFMVisitParam
  | IFFMVisit
  | IFeedback
  | IInspectionReport
  | Report
  | IReportSpace[]
  | ILocalSpaceUpdatePayload
  | Tabs
  | IAssetSearch
  | IFFMTicket;

export const FFMActions = {
  getOnBoardingData,
  getOnBoardingDataSuccess,
  getOnBoardingDataFailure,
  getRoles,
  getRolesSuccess,
  getRolesFailure,
  setSelectedRole,
  setWorkLocations,
  getVisits,
  getVisitsSuccess,
  getVisitsFailure,
  getVisitDetail,
  getVisitDetailSuccess,
  getVisitDetailFailure,
  getRejectionReasons,
  getRejectionReasonsSuccess,
  getRejectionReasonsFailure,
  getFeedback,
  getFeedbackSuccess,
  getFeedbackFailure,
  clearFeedbackData,
  getInspectionReport,
  getInspectionReportSuccess,
  getInspectionReportFailure,
  setCurrentReport,
  clearCurrentReport,
  getReportSpace,
  getReportSpaceSuccess,
  getReportSpaceFailure,
  setReportSpaceData,
  clearSpaceData,
  getSpaceDetail,
  getSpaceDetailSuccess,
  getSpaceDetailFailure,
  setDeeplinkData,
  getHotProperties,
  getHotPropertiesSuccess,
  getHotPropertiesFailure,
  getTickets,
  getTicketsSuccess,
  getTicketsFailure,
  getTicketDetail,
  getTicketActions,
};
