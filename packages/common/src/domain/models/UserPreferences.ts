import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { IUnit, Unit } from '@homzhub/common/src/domain/models/Unit';
import { Currency, ICurrency } from '@homzhub/common/src/domain/models/Currency';

export enum UserPreferencesKeys {
  CurrencyKey = 'currency',
  LanguageKey = 'language',
  FinancialYear = 'financial_year',
  MetricUnit = 'metric_unit',
  AccountDeactivated = 'account_deactivated',
  FaceId = 'face_id',
  Fingerprint = 'fingerprint',
  TwoFactorAuthentication = 'two_factor_authentication',
  Theme = 'theme',
  IsLastNameObfuscated = 'is_last_name_obfuscated',
  IsMobileNumberObfuscated = 'is_mobile_number_obfuscated',
  IsEmailObfuscated = 'is_email_obfuscated',
  AnalyseAppIssuesAndEvents = 'analyseAppIssuesAndEvents',
  PushNotifications = 'is_push_notification_enabled',
  EmailsText = 'is_email_notification_enabled',
  MessagesText = 'is_message_notification_enabled',
  WebView = 'webview',
}

export enum MetricSystems {
  KILOMETERS = 'km',
  METERS = 'm',
  MILES = 'mi',
}

export interface IUserPreferences {
  currency: ICurrency;
  language: IUnit;
  financial_year: IUnit;
  metric_unit: IUnit;
  account_deactivated: boolean;
}

@JsonObject('UserPreferences')
export class UserPreferences {
  @JsonProperty('currency', Currency)
  private _currency = new Currency();

  @JsonProperty('language', Unit)
  private _language = new Unit();

  @JsonProperty('financial_year', Unit)
  private _financialYear = new Unit();

  @JsonProperty('metric_unit', String)
  private _metricUnit = '';

  @JsonProperty('account_deactivated', Boolean)
  private _accountDeactivated = false;

  @JsonProperty('face_id', Boolean, true)
  private _faceId = false;

  @JsonProperty('fingerprint', Boolean, true)
  private _fingerprint = false;

  @JsonProperty('two_factor_authentication', Boolean, true)
  private _twoFactorAuthentication = false;

  @JsonProperty('theme', String, true)
  private _theme = '';

  @JsonProperty('is_last_name_obfuscated', Boolean, true)
  private _isLastNameObfuscated = true;

  @JsonProperty('is_mobile_number_obfuscated', Boolean, true)
  private _isMobileNumberObfuscated = true;

  @JsonProperty('is_email_obfuscated', Boolean, true)
  private _isEmailObfuscated = true;

  @JsonProperty('is_push_notification_enabled', Boolean, true)
  private _pushNotifications = false;

  @JsonProperty('is_email_notification_enabled', Boolean, true)
  private _email = false;

  @JsonProperty('is_message_notification_enabled', Boolean, true)
  private _message = false;

  get currency(): string {
    return this._currency.currencyCode;
  }

  get faceId(): boolean {
    return this._faceId;
  }

  get fingerprint(): boolean {
    return this._fingerprint;
  }

  get twoFactorAuthentication(): boolean {
    return this._twoFactorAuthentication;
  }

  get theme(): string {
    return this._theme;
  }

  get isLastNameObfuscated(): boolean {
    return this._isLastNameObfuscated;
  }

  get isMobileNumberObfuscated(): boolean {
    return this._isMobileNumberObfuscated;
  }

  get isEmailObfuscated(): boolean {
    return this._isEmailObfuscated;
  }

  get pushNotifications(): boolean {
    return this._pushNotifications;
  }

  get email(): boolean {
    return this._email;
  }

  get message(): boolean {
    return this._message;
  }

  get language(): number {
    return this._language.id;
  }

  get languageCode(): string {
    return this._language.code;
  }

  get financialYear(): number {
    return this._financialYear.id;
  }

  get financialYearCode(): string {
    return this._financialYear.code;
  }

  get metricUnit(): MetricSystems {
    return this._metricUnit as MetricSystems;
  }

  get accountDeactivated(): boolean {
    return this._accountDeactivated;
  }

  get currencyObj(): Currency {
    return this._currency;
  }
}
