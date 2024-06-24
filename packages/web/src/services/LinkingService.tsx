import { Linking } from 'react-native';

type imageType =
  | 'apple'
  | 'google'
  | 'appleLarge'
  | 'googleLarge'
  | 'instagram'
  | 'twitter'
  | 'youtube'
  | 'linkedin'
  | 'facebook';

export const URLs = {
  appStore: 'https://apps.apple.com/gb/app/homzhub-property-management/id1516772395',
  playStore: 'https://play.google.com/store/apps/details?id=com.homzhub',
  instagram: 'https://www.instagram.com/homzhub/',
  twitter: 'https://twitter.com/homzhub',
  youtube: ' https://www.youtube.com/channel/UCA1rqRgmez8a8gTaPYm-dxQ',
  linkedin: 'https://www.linkedin.com/company/homzhubpropertymanagement',
  facebook: 'https://www.facebook.com/HomzHub',
  featuredPropertiesSearch: 'https://homzhub.netlify.app/search',
  featuredProperties: 'https://homzhub.netlify.app/properties',
};

const imagePath = {
  apple: require('@homzhub/common/src/assets/images/appStore.svg'),
  google: require('@homzhub/common/src/assets/images/playStore.svg'),
  appleLarge: require('@homzhub/common/src/assets/images/appStoreLarge.svg'),
  googleLarge: require('@homzhub/common/src/assets/images/playStoreLarge.svg'),
  instagram: require('@homzhub/common/src/assets/images/instagram.svg'),
  twitter: require('@homzhub/common/src/assets/images/twitter.svg'),
  youtube: require('@homzhub/common/src/assets/images/youtubeTransparent.svg'),
  linkedin: require('@homzhub/common/src/assets/images/linkedinTransparent.svg'),
  facebook: require('@homzhub/common/src/assets/images/facebookTransparent.svg'),
};

export enum Images {
  APPLE = 'apple',
  APPLELARGE = 'appleLarge',
  GOOGLE = 'google',
  GOOGLELARGE = 'googleLarge',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
  LINKEDIN = 'linkedin',
  FACEBOOK = 'facebook',
}

class LinkingService {
  public getImage = (type: imageType): string => {
    switch (type) {
      case Images.APPLE:
        return imagePath.apple;
      case Images.APPLELARGE:
        return imagePath.appleLarge;
      case Images.GOOGLE:
        return imagePath.google;
      case Images.INSTAGRAM:
        return imagePath.instagram;
      case Images.TWITTER:
        return imagePath.twitter;
      case Images.YOUTUBE:
        return imagePath.youtube;
      case Images.LINKEDIN:
        return imagePath.linkedin;
      case Images.FACEBOOK:
        return imagePath.facebook;
      default:
        return imagePath.googleLarge;
    }
  };

  public getUrl = (type: imageType): string => {
    switch (type) {
      case Images.APPLE:
        return URLs.appStore;
      case Images.APPLELARGE:
        return URLs.appStore;
      case Images.GOOGLE:
        return URLs.playStore;
      case Images.INSTAGRAM:
        return URLs.instagram;
      case Images.TWITTER:
        return URLs.twitter;
      case Images.YOUTUBE:
        return URLs.youtube;
      case Images.LINKEDIN:
        return URLs.linkedin;
      case Images.FACEBOOK:
        return URLs.facebook;
      default:
        return URLs.playStore;
    }
  };

  public redirect = (link: string): void => {
    Linking.canOpenURL(link).then((supported) => {
      if (supported) {
        Linking.openURL(link).then();
      }
    });
  };

  public redirectInNewTab = (link: string): void => {
    window.open(link);
  };
}

const linkingService = new LinkingService();
export { linkingService as LinkingService };
