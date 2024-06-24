import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Feedback } from '@homzhub/common/src/domain/models/Feedback';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { InspectionReport } from '@homzhub/common/src/domain/models/InspectionReport';
import { OnBoarding } from '@homzhub/common/src/domain/models/OnBoarding';
import { Report } from '@homzhub/common/src/domain/models/Report';
import { ReportSpace } from '@homzhub/common/src/domain/models/ReportSpace';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IWorkLocation } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IFFMState, ILocalSpaceUpdatePayload } from '@homzhub/common/src/modules/ffm/interface';

const getFFMLoaders = (state: IState): IFFMState['loaders'] => {
  return state.ffm.loaders;
};

const getOnBoardingData = (state: IState): OnBoarding[] => {
  const {
    ffm: { onBoardingData },
  } = state;
  if (onBoardingData.length < 1) return [];
  return ObjectMapper.deserializeArray(OnBoarding, onBoardingData);
};

const getRoles = (state: IState): Unit[] => {
  const {
    ffm: { roles },
  } = state;
  if (roles.length < 1) return [];
  return ObjectMapper.deserializeArray(Unit, roles);
};

const getSelectedRole = (state: IState): Unit | null => {
  const {
    ffm: { selectedRole },
  } = state;
  return selectedRole;
};

const getWorkLocations = (state: IState): IWorkLocation[] => {
  const {
    ffm: { workLocations },
  } = state;
  return workLocations;
};

const getVisits = (state: IState): FFMVisit[] => {
  const {
    ffm: { visits },
  } = state;
  if (visits.length < 1) return [];
  return ObjectMapper.deserializeArray(FFMVisit, visits);
};

const getVisitDetail = (state: IState): FFMVisit | null => {
  const {
    ffm: { visitDetail },
  } = state;
  if (!visitDetail) return null;
  return ObjectMapper.deserialize(FFMVisit, visitDetail);
};

const getRejectionReason = (state: IState): IDropdownOption[] => {
  const {
    ffm: { reasons },
  } = state;

  const deserializedData = ObjectMapper.deserializeArray(Unit, reasons);

  return deserializedData.map((item) => {
    return {
      label: item.title,
      value: item.id,
    };
  });
};

const getFeedback = (state: IState): Feedback | null => {
  const {
    ffm: { feedback },
  } = state;
  if (!feedback) return null;
  return ObjectMapper.deserialize(Feedback, feedback);
};

const getInspectionReport = (state: IState): InspectionReport | null => {
  const {
    ffm: { inspectionReport },
  } = state;
  if (!inspectionReport) return null;
  return ObjectMapper.deserialize(InspectionReport, inspectionReport);
};

const getCurrentReport = (state: IState): Report | null => {
  const {
    ffm: { currentReport },
  } = state;
  if (!currentReport) return null;
  return currentReport;
};

const getReportSpaces = (state: IState): ReportSpace[] => {
  const {
    ffm: { reportSpace },
  } = state;
  if (reportSpace.length < 1) return [];
  return ObjectMapper.deserializeArray(ReportSpace, reportSpace);
};

const getReportSpaceData = (state: IState): ILocalSpaceUpdatePayload => {
  const {
    ffm: { reportSpaceData },
  } = state;
  return reportSpaceData;
};

const getDeeplinkData = (state: IState): boolean => {
  const {
    ffm: { isFromDeeplink },
  } = state;
  return isFromDeeplink;
};

const getHotProperties = (state: IState): Asset[] => {
  const {
    ffm: { hotProperties },
  } = state;
  if (!hotProperties) return [];
  return ObjectMapper.deserializeArray(Asset, hotProperties.results);
};

const getTickets = (state: IState): Ticket[] => {
  const {
    ffm: { tickets },
  } = state;
  if (!tickets) return [];
  return ObjectMapper.deserializeArray(Ticket, tickets.results);
};

export const FFMSelector = {
  getFFMLoaders,
  getOnBoardingData,
  getRoles,
  getSelectedRole,
  getWorkLocations,
  getVisits,
  getVisitDetail,
  getRejectionReason,
  getFeedback,
  getInspectionReport,
  getCurrentReport,
  getReportSpaces,
  getReportSpaceData,
  getDeeplinkData,
  getHotProperties,
  getTickets,
};
