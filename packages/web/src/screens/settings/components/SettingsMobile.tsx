import React, { ReactElement, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import DisplayCautionModal from '@homzhub/web/src/screens/settings/components/DisplayCautionModal';
import { OptionTypes, SelectedPreferenceType, SettingOptions } from '@homzhub/common/src/domain/models/SettingOptions';
import { SettingsData, SettingsDataNameKeys } from '@homzhub/common/src/domain/models/SettingsData';
import { SettingsDropdownValues } from '@homzhub/common/src/domain/models/SettingsDropdownValues';
import { UserPreferences, UserPreferencesKeys } from '@homzhub/common/src/domain/models/UserPreferences';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IUpdateUserPreferences } from '@homzhub/common/src/domain/repositories/interfaces';

interface IDispatchProps {
  updateUserPreferences: (payload: IUpdateUserPreferences) => void;
}
interface IStateProps {
  userPreferences: UserPreferences;
  isUserPreferencesLoading: boolean;
}

type IOwnProps = IStateProps & IDispatchProps;

const Settings: FC<IOwnProps> = (props: IOwnProps) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.moreSettings);
  const { userPreferences } = props;
  const [settingData, setSettingData] = useState<SettingsData[]>([]);
  const [cautionMessage, setCautionMessage] = useState(false);
  const [keys, setKeys] = useState('');
  const [values, setValues] = useState<SelectedPreferenceType>('');
  const [messages, setMessages] = useState('');
  const [messageTitle, setMessageTitle] = useState('');

  useEffect(() => {
    getSettingData().then();
  }, [userPreferences]);

  const getSettingData = async (): Promise<void> => {
    try {
      const settingsData = UserRepository.getSettingScreenData();
      const settingDropDownValues = await UserRepository.getSettingDropDownValues();
      const filteredData = settingsData.filter((item) => item.visible === true);
      populateSettingOptions(filteredData, settingDropDownValues);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  const populateSettingOptions = (
    settingsData: SettingsData[],
    settingDropDownValues: SettingsDropdownValues
  ): void => {
    settingsData.forEach((item) => {
      item.options.forEach((option) => {
        switch (option.name) {
          case UserPreferencesKeys.CurrencyKey:
            option.options = settingDropDownValues.currency;
            option.selected = userPreferences.currency;
            break;
          case UserPreferencesKeys.LanguageKey:
            option.options = settingDropDownValues.language;
            option.selected = userPreferences.language;
            break;
          case UserPreferencesKeys.FinancialYear:
            option.options = settingDropDownValues.financialYear;
            option.selected = userPreferences.financialYear;
            break;
          case UserPreferencesKeys.MetricUnit:
            option.options = settingDropDownValues.metricUnit;
            option.selected = userPreferences.metricUnit;
            break;
          case UserPreferencesKeys.IsLastNameObfuscated:
            option.selected = userPreferences.isLastNameObfuscated;
            break;
          case UserPreferencesKeys.IsMobileNumberObfuscated:
            option.selected = userPreferences.isMobileNumberObfuscated;
            break;
          case UserPreferencesKeys.IsEmailObfuscated:
            option.selected = userPreferences.isEmailObfuscated;
            break;
          case UserPreferencesKeys.PushNotifications:
            option.selected = userPreferences.pushNotifications;
            break;
          case UserPreferencesKeys.MessagesText:
            option.selected = userPreferences.message;
            break;
          case UserPreferencesKeys.EmailsText:
            option.selected = userPreferences.email;
            break;
          default:
            option.options = [];
            option.selected = false;
        }
      });
    });
    setSettingData(settingsData);
  };
  const handlePreferenceUpdate = (titleText: string, key: string, value: SelectedPreferenceType): void => {
    const {
      IsEmailObfuscated,
      IsLastNameObfuscated,
      IsMobileNumberObfuscated,
      PushNotifications,
      EmailsText,
      MessagesText,
    } = UserPreferencesKeys;
    const enableContinueModal =
      key === IsEmailObfuscated || key === IsLastNameObfuscated || key === IsMobileNumberObfuscated;

    const enableCommunicationsContinueModal =
      (key === PushNotifications || key === EmailsText || key === MessagesText) && !value;

    let updatedValue = value;

    if (enableContinueModal) {
      updatedValue = !value;
    }
    if (!enableContinueModal && !enableCommunicationsContinueModal) {
      updatePreferences(key, updatedValue);
    } else {
      setKeys(key);
      setMessageTitle(titleText);
      setValues(updatedValue);
      const cautionMessageValue = getCautionMessageFor(key, value);
      setMessages(cautionMessageValue);
      setCautionMessage(true);
    }
  };
  const getCautionMessageFor = (key: string, value: SelectedPreferenceType): string => {
    let message: string;
    switch (key) {
      case UserPreferencesKeys.EmailsText:
        message = t('communicationsCautionText', { name: t('auth:emailText') });
        break;
      case UserPreferencesKeys.MessagesText:
        message = t('communicationsCautionText', { name: t('messagesText') });
        break;
      case UserPreferencesKeys.PushNotifications:
        message = t('communicationsCautionText', { name: t('pushNotifications') });
        break;
      case UserPreferencesKeys.IsLastNameObfuscated:
        message = value
          ? t('dataPrivacyCautionTextWhenEnabling', { name: t('property:lastName') })
          : t('dataPrivacyCautionTextWhenDisabling', { name: t('property:lastName') });
        break;
      case UserPreferencesKeys.IsMobileNumberObfuscated:
        message = value
          ? t('dataPrivacyCautionTextWhenEnabling', { name: t('common:mobileNumber') })
          : t('dataPrivacyCautionTextWhenDisabling', { name: t('common:mobileNumber') });
        break;
      case UserPreferencesKeys.IsEmailObfuscated:
        message = value
          ? t('dataPrivacyCautionTextWhenEnabling', { name: t('common:email') })
          : t('dataPrivacyCautionTextWhenDisabling', { name: t('common:email') });
        break;
      default:
        message = '';
    }
    return message;
  };

  const updatePreferences = (key: string, value: SelectedPreferenceType): void => {
    const { updateUserPreferences } = props;
    updateUserPreferences({ [key]: value });
  };

  const navigateToWebview = (url: string): void => {
    NavigationService.openNewTab({ path: url });
  };

  const renderSubTitle = (title: string, options: SettingOptions, showDivider: boolean): ReactElement => {
    return (
      <>
        <TouchableOpacity
          style={[styles.rowStyle, styles.subTitleView]}
          disabled={options.type !== OptionTypes.Webview}
          onPress={(): void => navigateToWebview(options.url)}
        >
          <Label style={styles.subTitle} type="large">
            {t(options.label)}
          </Label>
          {renderOptionTypes(title, options)}
        </TouchableOpacity>
        {showDivider && (
          <View style={styles.paddingLeft}>
            <Divider />
          </View>
        )}
      </>
    );
  };

  const renderOptionTypes = (title: string, options: SettingOptions): ReactElement => {
    let renderElement: ReactElement;
    let navigateToLink: () => void;
    const handleChange = (value: SelectedPreferenceType): void => {
      handlePreferenceUpdate(title, options.name, value);
    };
    switch (options.type) {
      case OptionTypes.Webview:
        navigateToLink = (): void => navigateToWebview(options.url);

        renderElement = (
          <Icon size={20} name={icons.rightArrow} color={theme.colors.primaryColor} onPress={navigateToLink} />
        );
        break;
      case OptionTypes.Dropdown:
        renderElement = (
          <Dropdown
            value={options.selected}
            data={options.options}
            onDonePress={handleChange}
            icon={icons.downArrow}
            iconColor={theme.colors.primaryColor}
            containerStyle={styles.dropDownStyle}
            textStyle={styles.primaryColor}
            fontWeight="semiBold"
          />
        );
        break;
      default:
        if (title === SettingsDataNameKeys.communications)
          renderElement = <RNSwitch selected={options.selected as boolean} onToggle={handleChange} />;
        else renderElement = <RNSwitch selected={!options.selected} onToggle={handleChange} />;
    }

    return renderElement;
  };

  const renderTitle = (info: SettingsData, showDivider: boolean): React.ReactElement => {
    const title = t(info.name);

    return (
      <>
        <View style={styles.rowStyle}>
          {info.icon && <Icon size={20} name={info.icon} color={theme.colors.darkTint2} />}
          <Label style={styles.title} type="large" textType="semiBold">
            {title}
          </Label>
        </View>
        {info.options.map((option, index) => {
          return (
            <React.Fragment key={index}>
              {renderSubTitle(title, option, index < info.options.length - 1)}
            </React.Fragment>
          );
        })}
        {showDivider && <Divider containerStyles={styles.titleDividerStyles} />}
      </>
    );
  };
  const changeToggle = (): void => {
    setCautionMessage(false);
  };
  const onUpdatePreferences = (): void => {
    if (values !== undefined) {
      changeToggle();
      updatePreferences(keys, values);
    }
  };
  const settingsDataList =
    settingData &&
    settingData.map((item: SettingsData, index) => {
      return <React.Fragment key={index}>{renderTitle(item, index < settingData.length - 1)}</React.Fragment>;
    });
  return (
    <View style={styles.container}>
      <View style={styles.paddingBottom}>{settingsDataList}</View>
      <View style={styles.buttonContainerDeactivate}>
        <Typography variant="label" size="large" style={styles.textStlye}>
          {t('deactivateAccount')}
        </Typography>
      </View>
      {cautionMessage && (
        <DisplayCautionModal
          updatePreferences={onUpdatePreferences}
          message={messages}
          title={messageTitle}
          changeToggle={changeToggle}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state: IState): IStateProps => {
  const { getUserPreferences, isUserPreferencesLoading } = UserSelector;
  return {
    userPreferences: getUserPreferences(state),
    isUserPreferencesLoading: isUserPreferencesLoading(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { updateUserPreferences } = UserActions;
  return bindActionCreators({ updateUserPreferences }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 8,
    backgroundColor: theme.colors.white,
    width: '100%',
  },

  containerWeb: {
    height: 650,
  },
  divider: {
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
  rowStyle: {
    flexDirection: 'row',
    paddingHorizontal: theme.layout.screenPadding,
  },
  settingList: {
    marginVertical: 30,
    marginHorizontal: 25,
    width: '27%',
  },

  icon: { marginRight: 10 },

  titleDividerStyles: {
    borderColor: theme.colors.moreSeparator,
    borderWidth: 10,
    marginBottom: 16,
  },
  textStlye: {
    color: theme.colors.darkTint7,
    textAlign: 'center',
  },
  title: {
    marginLeft: 8,
    marginBottom: 8,
    color: theme.colors.darkTint2,
  },
  subTitleView: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  subTitle: {
    marginVertical: 16,
    marginLeft: 8,
    color: theme.colors.darkTint4,
  },

  paddingLeft: {
    paddingLeft: theme.layout.screenPadding + 8,
  },
  dropDownStyle: {
    paddingHorizontal: 0,
    borderWidth: 0,
  },
  primaryColor: {
    flex: 0,
    color: theme.colors.primaryColor,
  },
  buttonContainerDeactivate: {
    borderWidth: 1,
    height: 45,
    borderColor: theme.colors.darkTint7,
    borderRadius: 4,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    width: '90%',
    left: '5%',
  },
  paddingBottom: {
    paddingBottom: 50,
  },
});
