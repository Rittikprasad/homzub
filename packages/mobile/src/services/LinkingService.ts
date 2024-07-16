import { Linking } from 'react-native';
import firebase from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { DynamicLinkParamKeys, DynamicLinkTypes } from '@homzhub/mobile/src/services/constants';

// Todo: Import from firebase library
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

  // This methods helps to create a dynamic link using specified parameters
  public buildShortLink = async (type: DynamicLinkTypes, extraParams?: string): Promise<string> => {
    return await firebase.dynamicLinks().buildShortLink(
      {
        link: `${ConfigHelper.getMainUrl()}?${DynamicLinkParamKeys.Type}=${type}&${extraParams}`,
        android: {
          packageName: ConfigHelper.getAndroidAppId(),
          fallbackUrl: `${ConfigHelper.getMainUrl()}?${DynamicLinkParamKeys.Type}=${type}&${extraParams}`,
        },
        ios: {
          bundleId: ConfigHelper.getIosAppId(),
          appStoreId: ConfigHelper.getAppStoreId(),
          fallbackUrl: `${ConfigHelper.getMainUrl()}?${DynamicLinkParamKeys.Type}=${type}&${extraParams}`,
        },
        domainUriPrefix: ConfigHelper.getDynamicUrlPrefix(),
      },
      firebase.dynamicLinks.ShortLinkType.UNGUESSABLE
    );
  };

  public openDialer = async (phoneNumber: string): Promise<void> => {
    const url = `tel:${phoneNumber}`;

    if (!(await this.canOpenURL(url))) {
      return;
    }

    await Linking.openURL(url);
  };

  public openSMS = async ({ message, phoneNumber }: { message: string; phoneNumber?: string }): Promise<void> => {
    let url = 'sms:';
    const delimiter = PlatformUtils.isIOS() ? '&' : '?';
    if (phoneNumber) {
      url = `${url}${phoneNumber}${delimiter}body=${message}`;
    } else {
      url = `${url}${delimiter}body=${message}`;
    }

    if (!(await this.canOpenURL(url))) {
      return;
    }

    await Linking.openURL(url);
  };

  public openEmail = async ({
    body,
    email,
    subject,
  }: {
    body?: string;
    email?: string;
    subject?: string;
  }): Promise<void> => {
    let url = 'mailto:';

    if (email && !body) {
      url = `${url}${email}`;
    } else if (email) {
      url = `${url}${email}?body=${body}`;
    } else {
      url = `${url}?body=${body}`;
    }
    if (subject) {
      url = `${url}&subject=${subject}`;
    }

    if (!(await this.canOpenURL(url))) {
      return;
    }

    await Linking.openURL(url);
  };

  public whatsappMessage = async (phoneNumber: string, message: string): Promise<void> => {
    const url = `https://wa.me/${phoneNumber}/?text=${encodeURI(message)}`;

    if (!(await this.canOpenURL(url))) {
      AlertHelper.error({ message: I18nService.t('common:installWhatsapp') });
      return;
    }

    await Linking.openURL(url);
  };

  public openWhatsapp = async (message: string): Promise<void> => {
    const url = `https://wa.me/?text=${encodeURI(message)}`;

    if (!(await this.canOpenURL(url))) {
      AlertHelper.error({ message: I18nService.t('common:installWhatsapp') });
      return;
    }

    await Linking.openURL(url);
  };

  public canOpenURL = async (url: string): Promise<boolean> => {
    try {
      return await Linking.openURL(url);
    }catch (e: any) {      return false;
    }
  };
}

const linkingService = new LinkingService();
export { linkingService as LinkingService };
