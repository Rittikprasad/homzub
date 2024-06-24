import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { Feedback } from '@homzhub/common/src/domain/models/Feedback';
import { FFMMetrics } from '@homzhub/common/src/domain/models/FFMMetrics';
import { FFMTicket } from '@homzhub/common/src/domain/models/FFMTicket';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { InspectionFinalReport } from '@homzhub/common/src/domain/models/InspectionFinalReport';
import { InspectionReport } from '@homzhub/common/src/domain/models/InspectionReport';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { OutsetCheck } from '@homzhub/common/src/domain/models/OutsetCheck';
import { ReportSpace } from '@homzhub/common/src/domain/models/ReportSpace';
import { SpaceDetail } from '@homzhub/common/src/domain/models/SpaceDetail';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { TicketAction } from '@homzhub/common/src/domain/models/TicketAction';
import { TicketManagement } from '@homzhub/common/src/domain/models/TicketManagement';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IFFMVisitParam,
  IGetFeedbackParam,
  IGetSpaceDetail,
  IGetTicket,
  IOutsetCheckParam,
  IPostFeedback,
  IReportSpaceParam,
  IUpdateReport,
  IUpdateSpaceParam,
  IUpdateTicket,
  UserRole,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

const ENDPOINTS = {
  onBoarding: 'v1/ffm-onboardings',
  roles: 'v1/roles',
  visits: 'v1/ffm/tasks/site-visits/',
  userRole: () => 'v1/ffm/users/',
  visitDetail: (visitId: number): string => `v1/ffm/tasks/site-visits/${visitId}/`,
  rejectReason: (visitId: number): string => `v1/ffm/listing-visits/${visitId}/prospect-feedbacks/reject-reasons/`,
  feedback: (visitId: number): string => `v1/ffm/listing-visits/${visitId}/prospect-feedbacks/`,
  feedbackById: (visitId: number, feedbackId: number): string =>
    `v1/ffm/listing-visits/${visitId}/prospect-feedbacks/${feedbackId}`,
  inspectionReport: 'v1/ffm/tasks/inspection-reports/',
  inspectionReportById: (reportId: number): string => `v1/ffm/tasks/inspection-reports/${reportId}/`,
  outsetsCheck: (reportId: number): string => `v1/ffm/tasks/inspection-reports/${reportId}/outsets/`,
  reportSpaces: (reportId: number): string => `v1/ffm/tasks/inspection-reports/${reportId}/inspection-report-spaces/`,
  reportSpacesDetail: (reportId: number, spaceId: number): string =>
    `v1/ffm/tasks/inspection-reports/${reportId}/inspection-report-spaces/${spaceId}/`,
  spaceInspection: (reportId: number, spaceId: number): string =>
    `v1/ffm/tasks/inspection-reports/${reportId}/inspection-report-spaces/${spaceId}/space-inspections/`,
  finalReport: (reportId: number): string => `v1/ffm/tasks/inspection-reports/${reportId}/final-report/`,
  hotLeaseProperties: 'v1/ffm/assets/lease-listing-hot-properties/',
  hotSaleProperties: 'v1/ffm/assets/sale-listing-hot-properties/',
  managementTab: 'v1/ffm/management-tab',
  tickets: 'v1/ffm/tasks/tickets/',
  ticketManagement: 'v1/ffm/tasks/tickets/management-tab/',
  ticketById: (id: number): string => `v1/ffm/tasks/tickets/${id}/`,
  ticketActions: (id: number): string => `v1/ffm/tasks/tickets/${id}/actions/`,
};

class FFMRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getOnBoarding = async (): Promise<OnBoarding[]> => {
    const response = await this.apiClient.get(ENDPOINTS.onBoarding);
    return ObjectMapper.deserializeArray(OnBoarding, response);
  };

  public getRoles = async (): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.roles);
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public getVisits = async (param?: IFFMVisitParam): Promise<FFMVisit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.visits, param);
    return ObjectMapper.deserializeArray(FFMVisit, response);
  };

  public getVisitDetail = async (visitId: number): Promise<FFMVisit> => {
    const response = await this.apiClient.get(ENDPOINTS.visitDetail(visitId));
    return ObjectMapper.deserialize(FFMVisit, response);
  };

  public getRejectReason = async (visitId: number): Promise<Unit[]> => {
    const response = await this.apiClient.get(ENDPOINTS.rejectReason(visitId));
    return ObjectMapper.deserializeArray(Unit, response);
  };

  public postFeedback = async (payload: IPostFeedback): Promise<void> => {
    const { visitId, data } = payload;
    return await this.apiClient.post(ENDPOINTS.feedback(visitId), data);
  };

  public getFeedbackById = async (payload: IGetFeedbackParam): Promise<Feedback> => {
    const response = await this.apiClient.get(ENDPOINTS.feedbackById(payload.visitId, payload.feedbackId));
    return ObjectMapper.deserialize(Feedback, response);
  };

  public getInspectionReport = async (payload: string): Promise<InspectionReport> => {
    const response = await this.apiClient.get(ENDPOINTS.inspectionReport, { status_category: payload });
    return ObjectMapper.deserialize(InspectionReport, response);
  };

  public updateInspectionReport = async (payload: IUpdateReport): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.inspectionReportById(payload.reportId), {
      status: payload.status,
    });
  };

  public outsetsCheck = async (payload: IOutsetCheckParam): Promise<OutsetCheck> => {
    const response = await this.apiClient.post(ENDPOINTS.outsetsCheck(payload.reportId), payload.body);
    return ObjectMapper.deserialize(OutsetCheck, response);
  };

  public getReportSpaces = async (payload: number): Promise<ReportSpace[]> => {
    const response = await this.apiClient.get(ENDPOINTS.reportSpaces(payload));
    return ObjectMapper.deserializeArray(ReportSpace, response);
  };

  public createReportSpaces = async (payload: IReportSpaceParam): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.reportSpaces(payload.reportId), payload.body);
  };

  public updateSpaceDetail = async (payload: IUpdateSpaceParam): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.spaceInspection(payload.reportId, payload.spaceId), payload.body);
  };

  public getSpaceDetail = async (payload: IGetSpaceDetail): Promise<SpaceDetail> => {
    const response = await this.apiClient.get(ENDPOINTS.reportSpacesDetail(payload.reportId, payload.spaceId));
    return ObjectMapper.deserialize(SpaceDetail, response);
  };

  public getFinalReport = async (payload: number): Promise<InspectionFinalReport> => {
    const response = await this.apiClient.get(ENDPOINTS.finalReport(payload));
    return ObjectMapper.deserialize(InspectionFinalReport, response);
  };

  public getHotProperties = async (payload: Tabs): Promise<AssetSearch> => {
    const url = payload === Tabs.RENT ? ENDPOINTS.hotLeaseProperties : ENDPOINTS.hotSaleProperties;
    const response = await this.apiClient.get(url);
    return ObjectMapper.deserialize(AssetSearch, response);
  };

  public getManagementTab = async (): Promise<FFMMetrics> => {
    const response = await this.apiClient.get(ENDPOINTS.managementTab);
    return ObjectMapper.deserialize(FFMMetrics, response);
  };

  public getTickets = async (payload: IGetTicket): Promise<FFMTicket> => {
    const response = await this.apiClient.get(ENDPOINTS.tickets, payload);
    return ObjectMapper.deserialize(FFMTicket, response);
  };

  public updateTicket = async (payload: IUpdateTicket): Promise<void> => {
    return await this.apiClient.patch(ENDPOINTS.ticketById(payload.id), { action: payload.action });
  };

  public getTicketDetail = async (payload: number): Promise<Ticket> => {
    const response = await this.apiClient.get(ENDPOINTS.ticketById(payload));
    return ObjectMapper.deserialize(Ticket, response);
  };

  public getTicketActions = async (ticketId: number): Promise<TicketAction[]> => {
    const response = await this.apiClient.get(ENDPOINTS.ticketActions(ticketId));
    return ObjectMapper.deserializeArray(TicketAction, response);
  };

  public getTicketManagement = async (): Promise<TicketManagement> => {
    const response = await this.apiClient.get(ENDPOINTS.ticketManagement);
    return ObjectMapper.deserialize(TicketManagement, response);
  };

  public updateUserRole = async (payload: UserRole): Promise<void> => {
    const { data } = payload;
    return await this.apiClient.post(ENDPOINTS.userRole(), data);
  };
}

const ffmRepository = new FFMRepository();
export { ffmRepository as FFMRepository };
