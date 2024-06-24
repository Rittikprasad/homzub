import Config from 'react-native-config';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

export enum AppModes {
  DEBUG = 'DEBUG',
  RELEASE = 'RELEASE',
}

export enum ConfigModes {
  DEV = 'DEV',
  STAGE = 'STAGE',
  PROD = 'PROD',
}

export interface IAppFirebaseConfig {
  apiKey: string;
  projectId: string;
  appId: string;
  databaseURL: string;
  messagingSenderId: string;
  authDomain: string;
  storageBucket: string;
}

// For WEB
const {
  REACT_APP_API_BASE_URL = '',
  REACT_APP_PLACES_API_BASE_URL = '',
  REACT_APP_OTP_LENGTH = 6,
  REACT_APP_PLACES_API_KEY = '',
  REACT_APP_STORAGE_SECRET = '',
  REACT_APP_RAZOR_API_KEY = '',
  REACT_APP_YOUTUBE_API_KEY = '',
  REACT_APP_GOOGLE_CLIENT_ID = '',
  REACT_APP_FACEBOOK_CLIENT_ID = '',
  REACT_APP_MIXPANEL_KEY = '',
  REACT_APP_FACEBOOK_PIXEL_ID = '',
  REACT_APP_MODE = AppModes.DEBUG,
} = process.env;

// For MOBILE
const {
  REACT_NATIVE_APP_API_BASE_URL = 'https://testbaseurl.com',
  REACT_NATIVE_APP_PLACES_API_BASE_URL,
  REACT_NATIVE_APP_PLACES_API_KEY,
  REACT_NATIVE_APP_RAZOR_API_KEY,
  REACT_NATIVE_APP_OTP_LENGTH,
  REACT_NATIVE_APP_STORAGE_SECRET,
  REACT_NATIVE_APP_YOUTUBE_API_KEY,
  REACT_NATIVE_APP_MODE = AppModes.DEBUG,
  REACT_NATIVE_APP_GOOGLE_WEB_CLIENT_ID,
  REACT_NATIVE_APP_GOOGLE_IOS_CLIENT_ID,
  REACT_NATIVE_APP_MIXPANEL_KEY,
  REACT_NATIVE_APP_APPLE_STORE_URL,
  REACT_NATIVE_APP_GOOGLE_PLAYSTORE_URL,
  REACT_NATIVE_CONFIG_MODE = ConfigModes.DEV,
  REACT_NATIVE_MAIN_URL,
  REACT_NATIVE_ANDROID_APP_ID,
  REACT_NATIVE_IOS_APP_ID,
  REACT_NATIVE_APP_STORE_ID,
  // FIREBASE
  REACT_NATIVE_FIREBASE_API_KEY,
  REACT_NATIVE_FIREBASE_PROJECT_ID,
  REACT_NATIVE_FIREBASE_APP_ID,
  REACT_NATIVE_FIREBASE_DATABASE_URL,
  REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID,
  REACT_NATIVE_FIREBASE_AUTH_DOMAIN,
  REACT_NATIVE_FIREBASE_STORAGE_BUCKET,
  REACT_NATIVE_FIREBASE_DYNAMIC_URL,
} = Config;

class ConfigHelper {
  private readonly baseUrl: string;
  private readonly placesBaseUrl: string;
  private readonly otpLength: number;
  private readonly placesApiKey: string;
  private readonly storageKey: string;
  private readonly razorPayApiKey: string;
  private readonly youtubeApiKey: string;
  private readonly appMode: AppModes;
  private readonly mixpanelKey: string | undefined;
  private readonly googleWebClientId: string | undefined;
  private readonly googleIosClientId: string | undefined;
  private readonly facebookClientId: string | undefined;
  private readonly appleStoreUrl: string | undefined;
  private readonly googlePlayStoreUrl: string | undefined;
  private readonly facebookPixelId: string | undefined;
  private readonly configMode!: ConfigModes;
  private readonly appMainUrl!: string;
  private readonly androidAppId!: string;
  private readonly iodAppId!: string;
  private readonly appStoreId!: string;

  // FIREBASE - mobile only
  private readonly mobile_firebase_apiKey!: string;
  private readonly mobile_firebase_projectId!: string;
  private readonly mobile_firebase_appId!: string;
  private readonly mobile_firebase_databaseUrl!: string;
  private readonly mobile_firebase_messagingSenderId!: string;
  private readonly mobile_firebase_authDomain!: string;
  private readonly mobile_firebase_storageBucket!: string;
  private readonly mobile_firebase_dynamicUrl!: string;

  constructor() {
    this.baseUrl = REACT_APP_API_BASE_URL;
    this.placesBaseUrl = REACT_APP_PLACES_API_BASE_URL;
    this.otpLength = Number(REACT_APP_OTP_LENGTH);
    this.placesApiKey = REACT_APP_PLACES_API_KEY;
    this.storageKey = REACT_APP_STORAGE_SECRET;
    this.razorPayApiKey = REACT_APP_RAZOR_API_KEY;
    this.youtubeApiKey = REACT_APP_YOUTUBE_API_KEY;
    this.youtubeApiKey = REACT_NATIVE_APP_MODE;
    this.googleWebClientId = REACT_APP_GOOGLE_CLIENT_ID;
    this.facebookClientId = REACT_APP_FACEBOOK_CLIENT_ID;
    this.mixpanelKey = REACT_APP_MIXPANEL_KEY;
    this.facebookPixelId = REACT_APP_FACEBOOK_PIXEL_ID;
    this.appMode = REACT_APP_MODE as AppModes;

    if (PlatformUtils.isMobile()) {
      this.baseUrl = REACT_NATIVE_APP_API_BASE_URL;
      this.placesBaseUrl = REACT_NATIVE_APP_PLACES_API_BASE_URL;
      this.otpLength = Number(REACT_NATIVE_APP_OTP_LENGTH);
      this.placesApiKey = REACT_NATIVE_APP_PLACES_API_KEY;
      this.storageKey = REACT_NATIVE_APP_STORAGE_SECRET;
      this.razorPayApiKey = REACT_NATIVE_APP_RAZOR_API_KEY;
      this.youtubeApiKey = REACT_NATIVE_APP_YOUTUBE_API_KEY;
      this.appMode = REACT_NATIVE_APP_MODE as AppModes;
      this.googleWebClientId = REACT_NATIVE_APP_GOOGLE_WEB_CLIENT_ID;
      this.googleIosClientId = REACT_NATIVE_APP_GOOGLE_IOS_CLIENT_ID;
      this.mixpanelKey = REACT_NATIVE_APP_MIXPANEL_KEY;
      this.appleStoreUrl = REACT_NATIVE_APP_APPLE_STORE_URL;
      this.googlePlayStoreUrl = REACT_NATIVE_APP_GOOGLE_PLAYSTORE_URL;
      this.configMode = REACT_NATIVE_CONFIG_MODE as ConfigModes;
      this.appMainUrl = REACT_NATIVE_MAIN_URL;
      this.androidAppId = REACT_NATIVE_ANDROID_APP_ID;
      this.iodAppId = REACT_NATIVE_IOS_APP_ID;
      this.appStoreId = REACT_NATIVE_APP_STORE_ID;

      // FIREBASE
      this.mobile_firebase_apiKey = REACT_NATIVE_FIREBASE_API_KEY;
      this.mobile_firebase_projectId = REACT_NATIVE_FIREBASE_PROJECT_ID;
      this.mobile_firebase_appId = REACT_NATIVE_FIREBASE_APP_ID;
      this.mobile_firebase_databaseUrl = REACT_NATIVE_FIREBASE_DATABASE_URL;
      this.mobile_firebase_messagingSenderId = REACT_NATIVE_FIREBASE_MESSAGING_SENDER_ID;
      this.mobile_firebase_authDomain = REACT_NATIVE_FIREBASE_AUTH_DOMAIN;
      this.mobile_firebase_storageBucket = REACT_NATIVE_FIREBASE_STORAGE_BUCKET;
      this.mobile_firebase_dynamicUrl = REACT_NATIVE_FIREBASE_DYNAMIC_URL;
    }
  }

  public getBaseUrl = (): string => this.baseUrl;

  public getPlacesBaseUrl = (): string => this.placesBaseUrl;

  public getOtpLength = (): number => this.otpLength;

  public getPlacesApiKey = (): string => this.placesApiKey;

  public getStorageSecret = (): string => this.storageKey;

  public getRazorApiKey = (): string => this.razorPayApiKey;

  public getYoutubeApiKey = (): string => this.youtubeApiKey;

  public getAppMode = (): AppModes => this.appMode;

  public getMixpanelKey = (): string => this.mixpanelKey || '';

  public getGoogleWebClientId = (): string => this.googleWebClientId || '';

  public getGoogleIosClientId = (): string => this.googleIosClientId || '';

  public getFacebookClientId = (): string => this.facebookClientId || '';

  public getAppleStoreUrl = (): string => this.appleStoreUrl || '';

  public getGooglePlayStoreUrl = (): string => this.googlePlayStoreUrl || '';

  public getFacebookPixelId = (): string => this.facebookPixelId || '';

  public getConfigMode = (): ConfigModes => this.configMode;

  public getFirebaseConfig = (): IAppFirebaseConfig => ({
    apiKey: this.mobile_firebase_apiKey,
    projectId: this.mobile_firebase_projectId,
    appId: this.mobile_firebase_appId,
    databaseURL: this.mobile_firebase_databaseUrl,
    messagingSenderId: this.mobile_firebase_messagingSenderId,
    authDomain: this.mobile_firebase_authDomain,
    storageBucket: this.mobile_firebase_storageBucket,
  });

  public getDynamicUrlPrefix = (): string => this.mobile_firebase_dynamicUrl;

  public getMainUrl = (): string => this.appMainUrl;

  public getAndroidAppId = (): string => this.androidAppId;

  public getIosAppId = (): string => this.iodAppId;

  public getAppStoreId = (): string => this.appStoreId;
}

const configHelper = new ConfigHelper();
export { configHelper as ConfigHelper };
