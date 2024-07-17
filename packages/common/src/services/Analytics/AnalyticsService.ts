import { AppModes, ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { DeviceUtils } from '@homzhub/common/src/utils/DeviceUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { User } from '@homzhub/common/src/domain/models/User';
import { EventDataType } from '@homzhub/common/src/services/Analytics/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions,import/no-unresolved
import { Mixpanel } from './index';
// import Mixpanel from 'react-native-mixpanel';
// import { Mixpanel } from 'mixpanel-react-native';


class AnalyticsService {
  private projectToken: string = ConfigHelper.getMixpanelKey();
  private mixPanelInstance: Mixpanel | null = null;

  public initMixpanel = async (): Promise<void> => {
    if (PlatformUtils.isWeb()) {
      const mixpanelBrowser = require('mixpanel-browser');
      mixpanelBrowser.init(this.projectToken);
      this.mixPanelInstance = mixpanelBrowser;
    } else {
      this.mixPanelInstance = new Mixpanel(this.projectToken);
      await this.mixPanelInstance.init(); // Ensure initialization
      console.log(this.mixPanelInstance);
    }
  };

  public setUser = (user: User, callback: () => void): void => {
    if (!this.mixPanelInstance) return;

    if (user.email) {
      this.mixPanelInstance.identify(user.email);
    }
    const name = user.fullName || `${user.firstName} ${user.lastName}`;
    this.mixPanelInstance.people.set({ $email: user.email, $name: name });
    callback();
  };

  public track = (eventName: EventType, data?: EventDataType): void => {
    if (!this.mixPanelInstance) return;

    const user = StoreProviderService.getUserData();
    const {
      search: {
        filter: { user_location_latitude, user_location_longitude },
      },
    } = StoreProviderService.getStore().getState();
    const isDebugMode = ConfigHelper.getAppMode() === AppModes.DEBUG;
    if (isDebugMode && eventName === EventType.Exception) return;
    const properties = {
      token: this.projectToken,
      $event_name: eventName,
      // @ts-ignore
      distinct_id: data && data.email ? data.email : user?.email ?? DeviceUtils.getDeviceId(),
      email: user && user.email ? user.email : 'Anonymous',
      userId: user?.id,
      user_location_latitude,
      user_location_longitude,
      timeStamp: new Date().toISOString(),
      ...data,
    };

    this.mixPanelInstance.track(eventName, properties);
  };
}

const analyticsService = new AnalyticsService();
export { analyticsService as AnalyticsService };
