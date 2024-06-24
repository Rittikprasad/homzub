import { icons } from '@homzhub/common/src/assets/icon';
import { ISettingsData } from '@homzhub/common/src/domain/models/SettingsData';
import { OptionTypes } from '@homzhub/common/src/domain/models/SettingOptions';
import { UserPreferencesKeys } from '@homzhub/common/src/domain/models/UserPreferences';

export const SettingsScreenData: ISettingsData[] = [
  {
    name: 'loginSecurity',
    icon: icons.lock,
    visible: false,
    options: [
      {
        name: UserPreferencesKeys.FaceId,
        label: 'faceId',
        type: OptionTypes.Switch,
      },
      {
        name: UserPreferencesKeys.Fingerprint,
        label: 'fingerprint',
        type: OptionTypes.Switch,
      },
      {
        name: UserPreferencesKeys.TwoFactorAuthentication,
        label: 'twoFactorAuthentication',
        type: OptionTypes.Switch,
      },
    ],
  },
  {
    name: 'preferencesText',
    icon: icons.preference,
    visible: true,
    options: [
      {
        name: UserPreferencesKeys.CurrencyKey,
        label: 'currency',
        type: OptionTypes.Dropdown,
      },
      {
        name: UserPreferencesKeys.LanguageKey,
        label: 'language',
        type: OptionTypes.Dropdown,
      },
      {
        name: UserPreferencesKeys.FinancialYear,
        label: 'financialYear',
        type: OptionTypes.Dropdown,
      },
      {
        name: UserPreferencesKeys.MetricUnit,
        label: 'metricSystem',
        type: OptionTypes.Dropdown,
      },
    ],
  },
  {
    name: 'dataAndPrivacy',
    icon: icons.hand,
    visible: true,
    options: [
      {
        name: UserPreferencesKeys.IsLastNameObfuscated,
        label: 'showLastName',
        type: OptionTypes.Switch,
      },
      {
        name: UserPreferencesKeys.IsMobileNumberObfuscated,
        label: 'showMobileNumber',
        type: OptionTypes.Switch,
      },
      {
        name: UserPreferencesKeys.IsEmailObfuscated,
        label: 'showEmail',
        type: OptionTypes.Switch,
      },
    ],
  },
  {
    name: 'communications',
    icon: icons.communication,
    visible: true,
    options: [
      {
        name: UserPreferencesKeys.PushNotifications,
        label: 'pushNotifications',
        type: OptionTypes.Switch,
      },
      {
        name: UserPreferencesKeys.EmailsText,
        label: 'emailsText',
        type: OptionTypes.Switch,
      },
      {
        name: UserPreferencesKeys.MessagesText,
        label: 'messagesText',
        type: OptionTypes.Switch,
      },
    ],
  },
  {
    name: 'appInfo',
    icon: icons.detail,
    visible: true,
    options: [
      {
        name: 'releaseNotes',
        label: 'releaseNotes',
        type: OptionTypes.Webview,
        url: 'https://releases.homzhub.com/',
      },
      {
        name: 'termsConditionsText',
        label: 'termsConditionsText',
        type: OptionTypes.Webview,
        url: 'https://www.homzhub.com/terms&Condition',
      },
      {
        name: 'privacyPolicyText',
        label: 'privacyPolicyText',
        type: OptionTypes.Webview,
        url: 'https://www.homzhub.com/privacyPolicy',
      },
    ],
  },
];
