import { FFMActionPayloadTypes, FFMActionTypes } from '@homzhub/common/src/modules/ffm/actions';
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
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IFFMState, ILocalSpaceUpdatePayload } from '@homzhub/common/src/modules/ffm/interface';

const initialSpaceData: ILocalSpaceUpdatePayload = {
  condition_of_space: 0,
  comments: '',
  attachments: [],
  space_inspection_units: [],
};

export const initialFFMState: IFFMState = {
  onBoardingData: [],
  roles: [],
  selectedRole: null,
  workLocations: [],
  visits: [],
  visitDetail: null,
  reasons: [],
  feedback: null,
  inspectionReport: null,
  currentReport: null,
  reportSpace: [],
  isFromDeeplink: false,
  reportSpaceData: initialSpaceData,
  hotProperties: null,
  tickets: null,
  loaders: {
    onBoarding: false,
    roles: false,
    visits: false,
    visitDetail: false,
    reasons: false,
    feedback: false,
    inspectionReport: false,
    reportSpace: false,
    spaceDetail: false,
    hotProperties: false,
    tickets: false,
  },
};

export const ffmReducer = (
  state: IFFMState = initialFFMState,
  action: IFluxStandardAction<FFMActionPayloadTypes>
): IFFMState => {
  switch (action.type) {
    case FFMActionTypes.GET.ONBOARDING:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onBoarding']: true },
      };
    case FFMActionTypes.GET.ONBOARDING_SUCCESS:
      return {
        ...state,
        ['onBoardingData']: action.payload as IOnBoarding[],
        ['loaders']: { ...state.loaders, ['onBoarding']: false },
      };
    case FFMActionTypes.GET.ONBOARDING_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onBoarding']: false },
      };
    case FFMActionTypes.GET.ROLES:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['roles']: true },
      };
    case FFMActionTypes.GET.ROLES_SUCCESS:
      return {
        ...state,
        ['roles']: action.payload as IUnit[],
        ['loaders']: { ...state.loaders, ['roles']: false },
      };
    case FFMActionTypes.GET.ROLES_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['roles']: false },
      };
    case FFMActionTypes.SET.SELECTED_ROLE:
      return {
        ...state,
        ['selectedRole']: action.payload as Unit,
      };
    case FFMActionTypes.SET.WORK_LOCATION:
      return {
        ...state,
        ['workLocations']: action.payload as IWorkLocation[],
      };
    case FFMActionTypes.GET.VISITS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visits']: true },
      };
    case FFMActionTypes.GET.VISITS_SUCCESS:
      return {
        ...state,
        ['visits']: action.payload as IFFMVisit[],
        ['loaders']: { ...state.loaders, ['visits']: false },
      };
    case FFMActionTypes.GET.VISITS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visits']: false },
      };
    case FFMActionTypes.GET.VISIT_DETAIL:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visitDetail']: true },
      };
    case FFMActionTypes.GET.VISIT_DETAIL_SUCCESS:
      return {
        ...state,
        ['visitDetail']: action.payload as IFFMVisit,
        ['loaders']: { ...state.loaders, ['visitDetail']: false },
      };
    case FFMActionTypes.GET.VISIT_DETAIL_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visitDetail']: false },
      };
    case FFMActionTypes.GET.REJECTION_REASON:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reasons']: true },
      };
    case FFMActionTypes.GET.REJECTION_REASON_SUCCESS:
      return {
        ...state,
        ['reasons']: action.payload as IUnit[],
        ['loaders']: { ...state.loaders, ['reasons']: false },
      };
    case FFMActionTypes.GET.REJECTION_REASON_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reasons']: false },
      };
    case FFMActionTypes.GET.FEEDBACK:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['feedback']: true },
      };
    case FFMActionTypes.GET.FEEDBACK_SUCCESS:
      return {
        ...state,
        ['feedback']: action.payload as IFeedback,
        ['loaders']: { ...state.loaders, ['feedback']: false },
      };
    case FFMActionTypes.GET.FEEDBACK_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['feedback']: false },
      };
    case FFMActionTypes.CLEAR.FEEDBACK_DATA:
      return {
        ...state,
        ['feedback']: null,
      };
    case FFMActionTypes.GET.INSPECTION_REPORT:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['inspectionReport']: true },
      };
    case FFMActionTypes.GET.INSPECTION_REPORT_SUCCESS:
      return {
        ...state,
        ['inspectionReport']: action.payload as IInspectionReport,
        ['loaders']: { ...state.loaders, ['inspectionReport']: false },
      };
    case FFMActionTypes.GET.INSPECTION_REPORT_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['inspectionReport']: false },
      };
    case FFMActionTypes.SET.CURRENT_REPORT:
      return {
        ...state,
        ['currentReport']: action.payload as Report,
      };
    case FFMActionTypes.CLEAR.SELECTED_REPORT:
      return {
        ...state,
        ['currentReport']: null,
      };
    case FFMActionTypes.GET.REPORT_SPACE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reportSpace']: true },
      };
    case FFMActionTypes.GET.REPORT_SPACE_SUCCESS:
      return {
        ...state,
        ['reportSpace']: action.payload as IReportSpace[],
        ['loaders']: { ...state.loaders, ['reportSpace']: false },
      };
    case FFMActionTypes.GET.REPORT_SPACE_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reportSpace']: false },
      };
    case FFMActionTypes.SET.REPORT_SPACE_DATA:
      return {
        ...state,
        ['reportSpaceData']: action.payload as ILocalSpaceUpdatePayload,
      };
    case FFMActionTypes.CLEAR.SPACE_DATA:
      return {
        ...state,
        ['reportSpaceData']: { ...initialSpaceData, space_inspection_units: [] },
      };
    case FFMActionTypes.GET.SPACE_DETAIL:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['spaceDetail']: true },
      };
    case FFMActionTypes.GET.SPACE_DETAIL_SUCCESS:
    case FFMActionTypes.GET.SPACE_DETAIL_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['spaceDetail']: false },
      };
    case FFMActionTypes.SET.DEEPLINK_DATA:
      return {
        ...state,
        ['isFromDeeplink']: action.payload as boolean,
      };
    case FFMActionTypes.GET.HOT_PROPERTIES:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['hotProperties']: true },
      };
    case FFMActionTypes.GET.HOT_PROPERTIES_SUCCESS:
      return {
        ...state,
        ['hotProperties']: action.payload as IAssetSearch,
        ['loaders']: { ...state.loaders, ['hotProperties']: false },
      };
    case FFMActionTypes.GET.HOT_PROPERTIES_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['hotProperties']: false },
      };
    case FFMActionTypes.GET.FFM_TICKETS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['tickets']: true },
      };
    case FFMActionTypes.GET.FFM_TICKETS_SUCCESS:
      return {
        ...state,
        ['tickets']: action.payload as IFFMTicket,
        ['loaders']: { ...state.loaders, ['tickets']: false },
      };
    case FFMActionTypes.GET.FFM_TICKETS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['tickets']: false },
      };
    default:
      return {
        ...state,
      };
  }
};
