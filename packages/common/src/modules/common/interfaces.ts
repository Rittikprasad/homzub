import { IRedirectionDetails } from '@homzhub/mobile/src/services/LinkingService';
import { IRedirectionDetailsWeb } from '@homzhub/web/src/services/NavigationService';
import { ICountry } from '@homzhub/common/src/domain/models/Country';
import { IfscDetail } from '@homzhub/common/src/domain/models/IfscDetail';
import { IMessages, Messages } from '@homzhub/common/src/domain/models/Message';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { IPillar } from '@homzhub/common/src/domain/models/Pillar';

export interface ICommonState {
  countries: ICountry[];
  deviceCountry: string;
  messages: IMessages | null;
  attachment: string;
  redirectionDetails: IRedirectionDetails | IRedirectionDetailsWeb;
  currentChatDetail: IChatPayload | null;
  groupMessages: GroupMessage[] | null;
  pillars: IPillar[];
  reviewReferData: IReviewRefer | null;
  ifscDetail: IfscDetail;
  loaders: {
    groupMessages: boolean;
    messages: boolean;
    whileGetCountries: boolean;
    pillars: boolean;
  };
}

export interface IMessageSuccess {
  response: Messages;
  isNew?: boolean;
}

export interface IChatPayload {
  groupName: string;
  groupId: number;
}

export interface IReviewRefer {
  message?: string;
  isReview?: boolean;
  isSheetVisible?: boolean;
}
