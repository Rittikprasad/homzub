import { cloneDeep, findIndex } from 'lodash';
import { AssetNotifications, IAssetNotifications } from '@homzhub/common/src/domain/models/AssetNotifications';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';

class NotificationService {
  public transformNotificationsData = (
    newResponse: AssetNotifications,
    oldNotifications: AssetNotifications
  ): AssetNotifications => {
    const serializedNewResponse: IAssetNotifications = ObjectMapper.serialize(newResponse);
    const serializedOldResponse: IAssetNotifications = ObjectMapper.serialize(oldNotifications);
    const updatedNotifications = {
      ...serializedNewResponse,
      results:
        serializedOldResponse.results && serializedOldResponse.results.length > 0
          ? [...serializedOldResponse.results, ...serializedNewResponse.results]
          : serializedNewResponse.results,
    };
    return ObjectMapper.deserialize(AssetNotifications, updatedNotifications);
  };

  public getUpdatedNotifications = (id: number, notifications: AssetNotifications): AssetNotifications => {
    const notificationIndex = findIndex(notifications.results, (notification) => notification.id === id);
    if (notificationIndex !== -1) {
      const newNotifications = cloneDeep(notifications);
      newNotifications.results[notificationIndex].isRead = true;
      if (newNotifications.unreadCount > 0) {
        newNotifications.unreadCount -= 1;
      }
      return newNotifications;
    }
    return notifications;
  };
}

const notificationService = new NotificationService();
export { notificationService as NotificationService };
