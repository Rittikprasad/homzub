import { Linking } from 'react-native';
import firebase from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { NavigationService } from '@homzhub/ffm/src/services/NavigationService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';

type DynamicLinkType = {
  url: string;
  minimumAppVersion: number | string | null;
};

export interface IRedirectionDetails {
  redirectionLink: string;
  shouldRedirect: boolean;
}

const firebaseConfig = ConfigHelper.getFirebaseConfig();

class LinkingService {
  public firebaseInit = async (): Promise<void> => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }

    await this.listenToDynamicLinks();
  };

  // This method stores the dynamic link in the redux delegates the navigation errand to Navigation Service
  private handleDynamicLink = (url: string): void => {
    const store = StoreProviderService.getStore();
    const redirectionDetails = { redirectionLink: url, shouldRedirect: true };

    store.dispatch(CommonActions.setRedirectionDetails(redirectionDetails));
    NavigationService.handleDynamicLinkNavigation(redirectionDetails).then();
  };

  // This method listens to both background and foreground links
  private listenToDynamicLinks = async (): Promise<void> => {
    /* This part of the code handles links opened when app is in foreground state */
    dynamicLinks().onLink((link: DynamicLinkType) => {
      this.handleDynamicLink(link.url);
    });

    /* This part of the code handles links opened when app is in background state */
    await dynamicLinks()
      .getInitialLink()
      .then((link: DynamicLinkType | null) => {
        if (link) {
          this.handleDynamicLink(link.url);
        } else {
          // eslint-disable-next-line no-lonely-if
          if (PlatformUtils.isAndroid()) {
            Linking.getInitialURL()
              .then((url) => {
                this.handleDynamicLink(url || '');
                // do something with the URL
              })
              .catch((err) => err);
          } else {
            // handle case for iOS
          }
        }
      });
  };
}

const linkingService = new LinkingService();
export { linkingService as LinkingService };
