import { ReducerUtils } from '@homzhub/common/src/utils/ReducerUtils';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { IRedirectionDetailsWeb } from '@homzhub/web/src/services/NavigationService';
import { CommonActionPayloadTypes, CommonActionTypes } from '@homzhub/common/src/modules/common/actions';
import { ICountry } from '@homzhub/common/src/domain/models/Country';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { IfscDetail } from '@homzhub/common/src/domain/models/IfscDetail';
import { IPillar } from '@homzhub/common/src/domain/models/Pillar';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import {
  IChatPayload,
  ICommonState,
  IMessageSuccess,
  IReviewRefer,
} from '@homzhub/common/src/modules/common/interfaces';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';

export const initialCommonState: ICommonState = {
  countries: [],
  deviceCountry: '',
  attachment: '',
  messages: null,
  currentChatDetail: null,
  pillars: [],
  ifscDetail: new IfscDetail(),
  redirectionDetails: {
    redirectionLink: '',
    shouldRedirect: false,
    dynamicLinks: {
      routeType: '',
      type: '',
      params: {},
    },
  },
  groupMessages: null,
  reviewReferData: null,
  loaders: {
    groupMessages: false,
    messages: false,
    whileGetCountries: false,
    pillars: false,
  },
};

export const commonReducer = (
  state: ICommonState = initialCommonState,
  action: IFluxStandardAction<CommonActionPayloadTypes>
): ICommonState => {
  switch (action.type) {
    case CommonActionTypes.GET.COUNTRIES:
      return {
        ...state,
        countries: [],
        ['loaders']: { ...state.loaders, ['whileGetCountries']: true },
      };
    case CommonActionTypes.GET.COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: action.payload as ICountry[],
        ['loaders']: { ...state.loaders, ['whileGetCountries']: false },
      };
    case CommonActionTypes.GET.COUNTRIES_FALIURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['whileGetCountries']: false },
      };
    case CommonActionTypes.SET.DEVICE_COUNTRY:
      return {
        ...state,
        ['deviceCountry']: action.payload as string,
      };
    case CommonActionTypes.SET.REDIRECTION_DETAILS:
      return {
        ...state,
        ['redirectionDetails']: action.payload as IRedirectionDetails | IRedirectionDetailsWeb,
      };
    case CommonActionTypes.GET.MESSAGES:
      // eslint-disable-next-line no-case-declarations
      const { isNew: newData } = action.payload as IGetMessageParam;
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['messages']: !newData },
        ['messages']: !newData ? initialCommonState.messages : state.messages,
      };
    case CommonActionTypes.GET.MESSAGES_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const { response, isNew } = action.payload as IMessageSuccess;
      // eslint-disable-next-line no-case-declarations
      const messageResult = ReducerUtils.formatMessages(response.results, state.messages, isNew);
      return {
        ...state,
        messages: {
          count: response.count,
          links: response.links,
          messageResult,
        },
        ['loaders']: { ...state.loaders, ['messages']: false },
      };
    case CommonActionTypes.SET.MESSAGE_ATTACHMENT:
      return {
        ...state,
        ['attachment']: action.payload as string,
      };
    case CommonActionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        messages: initialCommonState.messages,
      };
    case CommonActionTypes.CLEAR_ATTACHMENT:
      return {
        ...state,
        attachment: initialCommonState.attachment,
      };
    case CommonActionTypes.GET.GROUP_MESSAGES:
      return {
        ...state,
        ['groupMessages']: null,
        ['loaders']: { ...state.loaders, ['groupMessages']: true },
      };
    case CommonActionTypes.GET.GROUP_MESSAGES_SUCCESS:
      return {
        ...state,
        ['groupMessages']: action.payload as GroupMessage[],
        ['loaders']: { ...state.loaders, ['groupMessages']: false },
      };
    case CommonActionTypes.SET.CURRENT_CHAT:
      return {
        ...state,
        currentChatDetail: action.payload as IChatPayload,
      };
    case CommonActionTypes.CLEAR_CHAT_DETAIL:
      return {
        ...state,
        currentChatDetail: initialCommonState.currentChatDetail,
      };
    case CommonActionTypes.GET.PILLARS:
      return {
        ...state,
        countries: [],
        ['loaders']: { ...state.loaders, ['pillars']: true },
      };
    case CommonActionTypes.GET.PILLARS_SUCCESS:
      return {
        ...state,
        ['pillars']: action.payload as IPillar[],
        ['loaders']: { ...state.loaders, ['pillars']: false },
      };
    case CommonActionTypes.GET.PILLARS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['pillars']: false },
      };
    case CommonActionTypes.SET.REVIEW_REFER_DATA:
      return {
        ...state,
        reviewReferData: action.payload as IReviewRefer,
      };
    case CommonActionTypes.SET.IFSC_DETAIL:
      return {
        ...state,
        ifscDetail: action.payload as IfscDetail,
      };
    case CommonActionTypes.CLEAR_IFSC_DETAIL:
      return {
        ...state,
        ifscDetail: initialCommonState.ifscDetail,
      };
    default:
      return {
        ...state,
      };
  }
};
