import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { IRedirectionDetailsWeb } from '@homzhub/web/src/services/NavigationService';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { IfscDetail } from '@homzhub/common/src/domain/models/IfscDetail';
import { IMessages } from '@homzhub/common/src/domain/models/Message';
import { Pillar } from '@homzhub/common/src/domain/models/Pillar';
import { IChatPayload, ICommonState, IReviewRefer } from '@homzhub/common/src/modules/common/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';

const getCountryList = (state: IState): Country[] => {
  const {
    common: { countries },
  } = state;
  return ObjectMapper.deserializeArray(Country, countries);
};

const getDeviceCountry = (state: IState): string => {
  const {
    common: { deviceCountry },
  } = state;
  return deviceCountry;
};

const getDefaultPhoneCode = (state: IState): string => {
  const countries = getCountryList(state);
  const deviceCountry = getDeviceCountry(state);

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].iso2Code === deviceCountry) {
      return countries[i].phoneCodes[0].phoneCode;
    }
  }

  return deviceCountry;
};

const getDefaultCurrency = (state: IState): Currency => {
  const countries = getCountryList(state);
  const deviceCountry = getDeviceCountry(state);

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].iso2Code === deviceCountry) {
      return countries[i].currencies[0];
    }
  }

  return new Currency();
};

const getRedirectionDetails = (state: IState): IRedirectionDetails | IRedirectionDetailsWeb => {
  const {
    common: { redirectionDetails },
  } = state;

  return redirectionDetails;
};

const getMessages = (state: IState): IMessages | null => {
  const {
    common: { messages },
  } = state;
  return messages;
};

const getMessagesLoading = (state: IState): boolean => {
  const {
    common: {
      loaders: { messages },
    },
  } = state;

  return messages;
};

const getMessageAttachment = (state: IState): string => {
  const {
    common: { attachment },
  } = state;
  return attachment;
};

const getGroupMessages = (state: IState): GroupMessage[] | null => {
  const {
    common: { groupMessages },
  } = state;
  if (!groupMessages) {
    return groupMessages;
  }

  return ObjectMapper.deserializeArray(GroupMessage, groupMessages);
};

const getGroupMessagesLoading = (state: IState): boolean => {
  const {
    common: {
      loaders: { groupMessages },
    },
  } = state;

  return groupMessages;
};

const getCurrentChatDetail = (state: IState): IChatPayload | null => {
  const {
    common: { currentChatDetail },
  } = state;

  return currentChatDetail;
};
const getCommonLoaders = (state: IState): ICommonState['loaders'] => {
  return state.common.loaders;
};

const getPillars = (state: IState): Pillar[] => {
  const {
    common: { pillars },
  } = state;

  if (pillars.length < 1) return [];

  return ObjectMapper.deserializeArray(Pillar, pillars);
};

const getReviewReferData = (state: IState): IReviewRefer | null => {
  const {
    common: { reviewReferData },
  } = state;

  if (!reviewReferData) return null;

  return reviewReferData;
};

const getIfscDetail = (state: IState): IfscDetail => {
  const {
    common: { ifscDetail },
  } = state;

  return ifscDetail;
};

export const CommonSelectors = {
  getCountryList,
  getDefaultPhoneCode,
  getDeviceCountry,
  getDefaultCurrency,
  getRedirectionDetails,
  getMessages,
  getMessageAttachment,
  getGroupMessages,
  getGroupMessagesLoading,
  getCurrentChatDetail,
  getMessagesLoading,
  getCommonLoaders,
  getPillars,
  getReviewReferData,
  getIfscDetail,
};
