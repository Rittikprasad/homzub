import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { IRedirectionDetailsWeb } from '@homzhub/web/src/services/NavigationService';
import { Country, ICountry } from '@homzhub/common/src/domain/models/Country';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { IfscDetail } from '@homzhub/common/src/domain/models/IfscDetail';
import { Messages } from '@homzhub/common/src/domain/models/Message';
import { IPillar, Pillar, PillarTypes } from '@homzhub/common/src/domain/models/Pillar';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { IChatPayload, IMessageSuccess, IReviewRefer } from '@homzhub/common/src/modules/common/interfaces';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'Common/';
export const CommonActionTypes = {
  GET: {
    COUNTRIES: `${actionTypePrefix}COUNTRIES`,
    COUNTRIES_SUCCESS: `${actionTypePrefix}COUNTRIES_SUCCESS`,
    COUNTRIES_FALIURE: `${actionTypePrefix}COUNTRIES_FALIURE`,
    MESSAGES: `${actionTypePrefix}MESSAGES`,
    MESSAGES_SUCCESS: `${actionTypePrefix}MESSAGES_SUCCESS`,
    GROUP_MESSAGES: `${actionTypePrefix}GROUP_MESSAGES`,
    GROUP_MESSAGES_SUCCESS: `${actionTypePrefix}GROUP_MESSAGES_SUCCESS`,
    PILLARS: `${actionTypePrefix}PILLARS`,
    PILLARS_SUCCESS: `${actionTypePrefix}PILLARS_SUCCESS`,
    PILLARS_FAILURE: `${actionTypePrefix}PILLARS_FAILURE`,
  },
  SET: {
    DEVICE_COUNTRY: `${actionTypePrefix}DEVICE_COUNTRY`,
    REDIRECTION_DETAILS: `${actionTypePrefix}REDIRECTION_DETAILS`,
    MESSAGE_ATTACHMENT: `${actionTypePrefix}MESSAGE_ATTACHMENT`,
    CURRENT_CHAT: `${actionTypePrefix}CURRENT_CHAT`,
    REVIEW_REFER_DATA: `${actionTypePrefix}REVIEW_REFER_DATA`,
    IFSC_DETAIL: `${actionTypePrefix}IFSC_DETAIL`,
  },
  CLEAR_MESSAGES: `${actionTypePrefix}CLEAR_MESSAGES`,
  CLEAR_ATTACHMENT: `${actionTypePrefix}CLEAR_ATTACHMENT`,
  CLEAR_CHAT_DETAIL: `${actionTypePrefix}CLEAR_CHAT_DETAIL`,
  CLEAR_IFSC_DETAIL: `${actionTypePrefix}CLEAR_IFSC_DETAIL`,
};

const getCountries = (): IFluxStandardAction => ({
  type: CommonActionTypes.GET.COUNTRIES,
});

const getCountriesSuccess = (payload: Country[]): IFluxStandardAction<ICountry[]> => ({
  type: CommonActionTypes.GET.COUNTRIES_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});
const getCountriesFaliure = (error: string): IFluxStandardAction => ({
  type: CommonActionTypes.GET.COUNTRIES_FALIURE,
  error,
});
const setDeviceCountry = (countryCode: string): IFluxStandardAction<string> => ({
  type: CommonActionTypes.SET.DEVICE_COUNTRY,
  payload: countryCode,
});

const setRedirectionDetails = (
  payload: IRedirectionDetails | IRedirectionDetailsWeb
): IFluxStandardAction<IRedirectionDetails | IRedirectionDetailsWeb> => ({
  type: CommonActionTypes.SET.REDIRECTION_DETAILS,
  payload,
});

const getMessages = (payload: IGetMessageParam): IFluxStandardAction<IGetMessageParam> => ({
  type: CommonActionTypes.GET.MESSAGES,
  payload,
});

const getMessagesSuccess = (payload: IMessageSuccess): IFluxStandardAction<IMessageSuccess> => ({
  type: CommonActionTypes.GET.MESSAGES_SUCCESS,
  payload,
});

const setAttachment = (payload: string): IFluxStandardAction<string> => ({
  type: CommonActionTypes.SET.MESSAGE_ATTACHMENT,
  payload,
});

const clearMessages = (): IFluxStandardAction => ({
  type: CommonActionTypes.CLEAR_MESSAGES,
});

const clearAttachment = (): IFluxStandardAction => ({
  type: CommonActionTypes.CLEAR_ATTACHMENT,
});

// TODO: (Shivam: 23/2/21: add types)
const getGroupMessage = (): IFluxStandardAction => ({
  type: CommonActionTypes.GET.GROUP_MESSAGES,
});

const getGroupMessageSuccess = (groupMessages: GroupMessage[]): IFluxStandardAction<GroupMessage[]> => ({
  type: CommonActionTypes.GET.GROUP_MESSAGES_SUCCESS,
  payload: ObjectMapper.serializeArray(groupMessages),
});

const setCurrentChatDetail = (payload: IChatPayload): IFluxStandardAction<IChatPayload> => ({
  type: CommonActionTypes.SET.CURRENT_CHAT,
  payload,
});

const clearChatDetail = (): IFluxStandardAction => ({
  type: CommonActionTypes.CLEAR_CHAT_DETAIL,
});

const getPillars = (payload: PillarTypes): IFluxStandardAction<PillarTypes> => ({
  type: CommonActionTypes.GET.PILLARS,
  payload,
});

const getPillarsSuccess = (payload: Pillar[]): IFluxStandardAction<IPillar[]> => ({
  type: CommonActionTypes.GET.PILLARS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getPillarsFailure = (): IFluxStandardAction => ({
  type: CommonActionTypes.GET.PILLARS_FAILURE,
});

const setReviewReferData = (payload: IReviewRefer): IFluxStandardAction<IReviewRefer> => ({
  type: CommonActionTypes.SET.REVIEW_REFER_DATA,
  payload,
});

const setIfscDetail = (payload: IfscDetail): IFluxStandardAction<IfscDetail> => ({
  type: CommonActionTypes.SET.IFSC_DETAIL,
  payload,
});

const clearIfscDetail = (): IFluxStandardAction => ({
  type: CommonActionTypes.CLEAR_IFSC_DETAIL,
});

export type CommonActionPayloadTypes =
  | ICountry[]
  | IRedirectionDetails
  | IGetMessageParam
  | IMessageSuccess
  | Messages
  | GroupMessage[]
  | IChatPayload
  | PillarTypes
  | IPillar[]
  | IReviewRefer
  | string
  | IfscDetail;

export const CommonActions = {
  getCountries,
  getCountriesSuccess,
  getCountriesFaliure,
  setDeviceCountry,
  setRedirectionDetails,
  getMessages,
  getMessagesSuccess,
  clearMessages,
  setAttachment,
  clearAttachment,
  getGroupMessage,
  getGroupMessageSuccess,
  setCurrentChatDetail,
  clearChatDetail,
  getPillars,
  getPillarsSuccess,
  getPillarsFailure,
  setReviewReferData,
  setIfscDetail,
  clearIfscDetail,
};
