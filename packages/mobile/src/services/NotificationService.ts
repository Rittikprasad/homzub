import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DeviceUtils } from '@homzhub/common/src/utils/DeviceUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { NotificationScreens, NotificationTypes } from '@homzhub/mobile/src/services/constants';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import {
  AppType,
  DetailType,
  IDeviceTokenPayload,
  ListingType,
} from '@homzhub/common/src/domain/repositories/interfaces';

const notificationScreenMap = {
  [NotificationTypes.Chat]: ScreensKeys.ChatScreen,
  [NotificationTypes.ServiceTicket]: ScreensKeys.ServiceTicketDetail,
  [NotificationTypes.Offer]: ScreensKeys.OfferDetail,
  [NotificationTypes.Asset]: ScreensKeys.Portfolio,
  [NotificationTypes.Campaign]: ScreensKeys.Dashboard,
};

const notificationSubScreenMap = {
  [NotificationScreens.OffersReceived]: ScreensKeys.PropertyOfferList,
  [NotificationScreens.OffersMade]: ScreensKeys.PropertyOfferList,
  [NotificationScreens.OfferDetail]: ScreensKeys.OfferDetail,
  [NotificationScreens.OfferChats]: ScreensKeys.ChatScreen,
};

const notificationParamsMap = {
  [NotificationScreens.OffersReceived]: { isReceivedFlow: true },
  [NotificationScreens.OffersMade]: { isReceivedFlow: false },
  [NotificationScreens.OfferDetail]: {},
  [NotificationScreens.OfferChats]: { isFromOffers: true, groupId: undefined, isFromNotifications: true },
};

interface INotificationData {
  [key: string]: string;
}

interface INotificationParams {
  [key: string]: any;
}

interface IGetCurrentNavigation {
  name: ScreensKeys;
  params: any;
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
          data,
        } = remoteMessage;
        const JSONDeeplinkData: INotificationData = JSON.parse(deeplink_metadata);
        const { type, screen } = JSONDeeplinkData;

        const store = StoreProviderService.getStore();

        const { message_group_id, message_group_name } = JSONDeeplinkData;
        const { name, params } = this.getCurrentNavigation();
        switch (type) {
          case NotificationTypes.Chat:
            {
              const groupId = params && params.groupId ? params.groupId : null;
              const isOnChatScreen = name === ScreensKeys.ChatScreen && groupId === message_group_id;

              if (isOnChatScreen) {
                store.dispatch(
                  CommonActions.getMessages({
                    groupId: Number(message_group_id),
                  })
                );
                CommonActions.setCurrentChatDetail({
                  groupName: message_group_name,
                  groupId: Number(message_group_id),
                });
              } else {
                store.dispatch(
                  CommonActions.getMessages({
                    groupId: Number(message_group_id),
                  })
                );
                AlertHelper.success({
                  message,
                  onPress: () => this.redirectOnNotification(data),
                  description: title,
                  duration: 5000,
                });
              }
            }
            break;
          default:
            if (type === NotificationTypes.Offer && screen === NotificationScreens.OfferChats) {
              const currentThreadId = store.getState().offer.currentOfferPayload?.threadId;
              const { currentChatDetail } = store.getState().common;
              const isOnSameChatScreen =
                name === ScreensKeys.ChatScreen && message_group_id === currentThreadId && !currentChatDetail;
              if (isOnSameChatScreen) {
                store.dispatch(OfferActions.getNegotiationComments({ isNew: true }));
                break;
              }
            }
            AlertHelper.success({
              message,
              onPress: () => this.redirectOnNotification(data),
              description: title,
              duration: type === NotificationTypes.Campaign ? 10000 : 5000,
            });
        }
      }
    });

    // Handle Notification when App is in backgound.
    this.messageObject.onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      const { data } = remoteMessage;
      if (data) {
        this.redirectOnNotification(data);
      }
    });
    // Handle Notification when App is quit / App is not opened.
    // eslint-disable-next-line max-len
    const remoteMessage: FirebaseMessagingTypes.RemoteMessage | null =
      await this.messageObject.getInitialNotification();
    if (remoteMessage && remoteMessage.data) {
      this.redirectOnNotification(remoteMessage.data);
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
      homzhub_app_type: AppType.MAIN,
    };

    await CommonRepository.postDeviceToken(payload);
  }

  private getCurrentNavigation = (): IGetCurrentNavigation => {
    const { navigation } = NavigationService;
    const currentRoute = navigation.getCurrentRoute();
    const { name, params } = currentRoute;
    return { name, params };
  };

  private redirectOnNotification = (data: { [key: string]: string } | undefined): void => {
    if (!data || !data.deeplink_metadata) {
      return;
    }

    const { deeplink_metadata } = data as INotificationData;
    const JSONDeeplinkData: INotificationData = JSON.parse(deeplink_metadata);
    const { type, screen, image_link, asset_id: assetId } = JSONDeeplinkData;

    const getScreenName = (notifType: string, notifScreen?: string): string => {
      if (notifType === NotificationTypes.Campaign) return ScreensKeys.DashboardLandingScreen;
      if (notifType === NotificationTypes.ValueAddedService) return ScreensKeys.ServicesDashboard;
      if (notifType === NotificationTypes.AssetDocuments) return ScreensKeys.DocumentScreen;
      if (notifType === NotificationTypes.ReferAndEarn) return ScreensKeys.ReferEarn;
      if (notifType === NotificationTypes.Due) return ScreensKeys.DuesScreen;

      return (
        (notifScreen
          ? notificationSubScreenMap[screen as NotificationScreens] || ScreensKeys.ChatScreen
          : notificationScreenMap[type as NotificationTypes]) || ScreensKeys.ChatScreen
      );
    };

    const getScreenParams = (notifType: string): INotificationParams => {
      if (notifType === NotificationTypes.Campaign) return { imageLink: image_link };
      if (notifType === NotificationTypes.AssetDocuments)
        return { isFromDashboard: true, propertyId: assetId, shouldReload: true };
      return notificationParamsMap[screen as NotificationScreens] || {};
    };

    const getNavigationTab = (notifType: string): string => {
      switch (notifType) {
        case NotificationTypes.AssetDocuments:
        case NotificationTypes.Campaign:
        case NotificationTypes.ReferAndEarn:
          return ScreensKeys.Dashboard;
        case NotificationTypes.Due:
          return ScreensKeys.Financials;
        default:
          return ScreensKeys.More;
      }
    };

    let navigationTab = getNavigationTab(type);

    const screenName = getScreenName(type, screen);
    const params = getScreenParams(type);
    const store = StoreProviderService.getStore();

    const { name: currentScreen } = this.getCurrentNavigation();

    switch (type) {
      case NotificationTypes.Chat:
        {
          const { message_group_id, message_group_name } = JSONDeeplinkData;

          store.dispatch(
            CommonActions.setCurrentChatDetail({
              groupName: message_group_name,
              groupId: Number(message_group_id),
            })
          );
          NavigationService.notificationNavigation(screenName, params, navigationTab);
        }
        break;
      case NotificationTypes.ServiceTicket:
        {
          navigationTab = ScreensKeys.More;

          const { object_id } = JSONDeeplinkData;
          store.dispatch(
            TicketActions.setCurrentTicket({
              ticketId: Number(object_id),
            })
          );
          if (currentScreen === ScreensKeys.ServiceTicketDetail) {
            store.dispatch(TicketActions.getTicketDetail(Number(object_id)));
            return;
          }

          NavigationService.notificationNavigation(screenName, params, navigationTab);
        }
        break;
      case NotificationTypes.Offer:
        {
          const isOnChatScreen = currentScreen === ScreensKeys.ChatScreen;
          const { lease_listing_id, sale_listing_id, message_group_id } = JSONDeeplinkData;
          navigationTab = ScreensKeys.More;

          store.dispatch(
            OfferActions.setCurrentOfferPayload({
              type: lease_listing_id ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
              listingId: Number(lease_listing_id) ?? Number(sale_listing_id) ?? 0,
              ...(message_group_id && Boolean(message_group_id.length) && { threadId: message_group_id }),
            })
          );

          if (isOnChatScreen) {
            store.dispatch(OfferActions.getNegotiationComments({ isNew: true }));
          }

          NavigationService.notificationNavigation(screenName, params, navigationTab);
        }
        break;

      case NotificationTypes.Asset:
        {
          const { asset_id, lease_unit_id } = JSONDeeplinkData;
          navigationTab = ScreensKeys.Portfolio;

          store.dispatch(
            PortfolioActions.setCurrentAsset({
              asset_id: Number(asset_id),
              listing_id: Number(lease_unit_id),
              assetType: DetailType.LEASE_UNIT,
            })
          );
          NavigationService.notificationNavigation(screenName, params, navigationTab);
        }
        break;
      case NotificationTypes.Campaign:
        if (!image_link || (image_link && image_link.length <= 0)) {
          NavigationService.notificationNavigation(
            ScreensKeys.AssetNotifications,
            { isFromDashboard: true },
            ScreensKeys.Dashboard
          );
          return;
        }
        if (currentScreen === ScreensKeys.DashboardLandingScreen) {
          NavigationService.setParams(params);
          return;
        }
        NavigationService.notificationNavigation(screenName, params, ScreensKeys.Dashboard);
        break;
      case NotificationTypes.AssetDocuments:
        if (currentScreen === ScreensKeys.DocumentScreen) {
          NavigationService.setParams(params);
          return;
        }
        NavigationService.notificationNavigation(screenName, params, navigationTab);
        break;
      case NotificationTypes.ReferAndEarn:
        if (currentScreen === ScreensKeys.ReferEarn) {
          NavigationService.setParams({ shouldReload: true });
          return;
        }
        NavigationService.notificationNavigation(screenName, params, navigationTab);
        break;
      case NotificationTypes.Due:
        NavigationService.notificationNavigation(screenName, params, navigationTab);
        break;
      default:
        NavigationService.notificationNavigation(screenName, params, navigationTab);
    }
  };
}

const notificationService = new NotificationService();
export { notificationService as NotificationService };
