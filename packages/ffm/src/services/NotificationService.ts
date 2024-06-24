import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DeviceUtils } from '@homzhub/common/src/utils/DeviceUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { AppType, IDeviceTokenPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { NotificationTypes } from '@homzhub/mobile/src/services/constants';

interface INotificationData {
  [key: string]: string;
}

class NotificationService {
  private messageObject: FirebaseMessagingTypes.Module;

  constructor() {
    this.messageObject = messaging();
  }

  public async init(): Promise<void> {
    await this.requestPermisson();
    await this.handleFirstTimeAppOpen();
    // Called when a new registration token is generated for the device/token expires/server invalidates the token.
    this.messageObject.onTokenRefresh(async (token) => {
      await StorageService.set(StorageKeys.DEVICE_TOKEN, token);
      await this.postDeviceToken();
    });

    await this.addNotificationListeners();
  }

  public async handleFirstTimeAppOpen(): Promise<void> {
    const isAppAlreadyOpened = (await StorageService.get<boolean>(StorageKeys.IS_APP_ALREADY_OPENED)) ?? false;

    if (isAppAlreadyOpened) {
      return;
    }

    await this.sendDeviceTokenToServer(true);
    await StorageService.set(StorageKeys.IS_APP_ALREADY_OPENED, true);
  }

  public addNotificationListeners = async (): Promise<void> => {
    // Handled Notification for foreground message / App is opened.
    this.messageObject.onMessage((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      if (remoteMessage.data) {
        const {
          data: { message, deeplink_metadata, title },
        } = remoteMessage;
        const JSONDeeplinkData: INotificationData = JSON.parse(deeplink_metadata);
        const { type } = JSONDeeplinkData;

        AlertHelper.success({
          message,
          onPress: FunctionUtils.noop,
          description: title,
          duration: type === NotificationTypes.Campaign ? 10000 : 5000,
        });
      }
    });

    // Handle Notification when App is in background.
    this.messageObject.onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      const { data } = remoteMessage;
      if (data) {
        // Add logic to navigate
      }
    });
    // Handle Notification when App is quit / App is not opened.
    // eslint-disable-next-line max-len
    const remoteMessage: FirebaseMessagingTypes.RemoteMessage | null =
      await this.messageObject.getInitialNotification();
    if (remoteMessage && remoteMessage.data) {
      // Add logic to navigate
    }
  };

  public getDeviceToken = async (): Promise<string | null> => {
    return await StorageService.get(StorageKeys.DEVICE_TOKEN);
  };

  public postDeviceToken = async (): Promise<void> => {
    const newDeviceToken = await this.messageObject.getToken();
    const oldDeviceToken = await this.getDeviceToken();

    const isDeviceTokenChanged = !oldDeviceToken || !newDeviceToken || newDeviceToken !== oldDeviceToken;

    if (!newDeviceToken || !isDeviceTokenChanged) {
      return;
    }

    await StorageService.set(StorageKeys.DEVICE_TOKEN, newDeviceToken);
    await this.sendDeviceTokenToServer();
  };

  public requestPermisson = async (): Promise<void> => {
    await this.messageObject.requestPermission({ sound: true, announcement: true });
  };

  public checkIsPermissionGranted = async (): Promise<boolean> => {
    const authStatus = await this.messageObject.hasPermission();
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      return true;
    }

    return false;
  };

  private async sendDeviceTokenToServer(isFirstTime = false): Promise<void> {
    const deviceToken = await this.messageObject.getToken();
    const deviceName = await DeviceUtils.getDeviceName();
    const deviceId = DeviceUtils.getDeviceId();

    const payload: IDeviceTokenPayload = {
      registration_id: deviceToken,
      device_id: deviceId,
      name: deviceName,
      type: PlatformUtils.getPlatform(),
      active: isFirstTime ? true : undefined,
      homzhub_app_type: AppType.FFM,
    };

    await CommonRepository.postDeviceToken(payload);
  }
}

const notificationService = new NotificationService();
export { notificationService as NotificationService };
