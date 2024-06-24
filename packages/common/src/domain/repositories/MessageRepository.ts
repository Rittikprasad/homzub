import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { GroupMessage } from '@homzhub/common/src/domain/models/GroupMessage';
import { Media } from '@homzhub/common/src/domain/models/Media';
import { Messages } from '@homzhub/common/src/domain/models/Message';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IGetMessageParam,
  IGroupChatInfoPayload,
  IMessagePayload,
  IUpdateMessagePayload,
} from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  groupMessage: (): string => 'v1/message-groups/',
  messages: (groupId: number): string => `v1/message-groups/${groupId}/messages/`,
  groupChatInfo: (groupId: number): string => `v1/message-groups/${groupId}/`,
  getChatAttachments: (groupId: number): string => `v1/message-groups/${groupId}/attachments/`,
};

class MessageRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getMessages = async (param: IGetMessageParam): Promise<Messages> => {
    const { groupId, count, cursor } = param;
    const response = await this.apiClient.get(ENDPOINTS.messages(groupId), { count, cursor });
    return ObjectMapper.deserialize(Messages, response);
  };

  public sendMessage = async (payload: IMessagePayload): Promise<void> => {
    const { groupId, message, attachments } = payload;
    return await this.apiClient.post(ENDPOINTS.messages(groupId), { message, attachments });
  };

  public updateMessage = async (payload: IUpdateMessagePayload): Promise<void> => {
    const { groupId, data } = payload;
    return await this.apiClient.patch(ENDPOINTS.messages(groupId), data);
  };

  public getGroupMessages = async (): Promise<GroupMessage[]> => {
    const result = await this.apiClient.get(ENDPOINTS.groupMessage());
    return ObjectMapper.deserializeArray(GroupMessage, result);
  };

  public getGroupChatInfo = async (payload: IGroupChatInfoPayload): Promise<GroupMessage> => {
    const { groupId } = payload;
    const response = await this.apiClient.get(ENDPOINTS.groupChatInfo(groupId));
    return ObjectMapper.deserialize(GroupMessage, response);
  };

  public getGroupChatMedia = async (payload: IGetMessageParam): Promise<Media> => {
    const { groupId, cursor, count } = payload;
    const response = await this.apiClient.get(ENDPOINTS.getChatAttachments(groupId), { cursor, count });
    return ObjectMapper.deserialize(Media, response);
  };
}

const messageRepository = new MessageRepository();
export { messageRepository as MessageRepository };
