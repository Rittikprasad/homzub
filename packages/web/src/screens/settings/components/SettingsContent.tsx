import React, { FC, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import DisplayCautionModal from '@homzhub/web/src/screens/settings/components/DisplayCautionModal';
import { OptionTypes, SelectedPreferenceType, SettingOptions } from '@homzhub/common/src/domain/models/SettingOptions';
import { SettingsData, SettingsDataNameKeys } from '@homzhub/common/src/domain/models/SettingsData';
import { UserPreferencesKeys } from '@homzhub/common/src/domain/models/UserPreferences';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  selectedSetting?: SettingsData;
  updatePreferences: (key: string, value: SelectedPreferenceType) => void;
  activeHeading: string;
}
const SettingsContent: FC<IProps> = (props: IProps) => {
  const { selectedSetting, updatePreferences, activeHeading } = props;
  const [cautionMessage, setCautionMessage] = useState(false);
  const [keys, setKeys] = useState('');
  const [values, setValues] = useState<SelectedPreferenceType>();
  const [messages, setMessages] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const { t } = useTranslation(LocaleConstants.namespacesKey.moreSettings);

  const subText = (): React.ReactElement => {
    return (
      <Typography variant="label" size="large" style={styles.subHeaderStyle}>
        {activeHeading}
      </Typography>
    );
  };
  if (selectedSetting === undefined) return null;
  const title = t(selectedSetting.name);
  const subTitle = (): React.ReactNode => {
    return selectedSetting.options.map((option, index) => {
      return (
        <>
          <TouchableOpacity
            style={styles.subTitleStyle}
            disabled={option.type !== OptionTypes.Webview}
            onPress={(): void => navigateToWebview(option.url)}
          >
            <Label type="large" style={styles.subHeaderStyle}>
              {t(option.label)}
            </Label>
            {renderOptionTypes(title, option)}
          </TouchableOpacity>
          {index < selectedSetting.options.length - 1 && (
            <View style={styles.divider}>
              <Divider />
            </View>
          )}
        </>
      );
    });
  };
  const navigateToWebview = (url: string): void => {
    NavigationService.openNewTab({ path: url });
  };

  const renderOptionTypes = (titleText: string, options: SettingOptions): React.ReactElement => {
    let renderElement: React.ReactElement;
    let navigateToLink: () => void;

    const handleChange = (value: SelectedPreferenceType): void => {
      handlePreferenceUpdate(titleText, options.name, value);
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
        if (titleText === SettingsDataNameKeys.communications)
          renderElement = <RNSwitch selected={options.selected as boolean} onToggle={handleChange} />;
        else renderElement = <RNSwitch selected={!options.selected} onToggle={handleChange} />;
    }
    return renderElement;
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
  const changeToggle = (): void => {
    setCautionMessage(false);
  };
  const onUpdatePreferences = (): void => {
    if (values !== undefined) {
      changeToggle();
      updatePreferences(keys, values);
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

  return (
    <View style={styles.selectedSettings}>
      <View style={styles.containerStyle}>
        <Typography variant="text" fontWeight="semiBold" size="regular">
          {t(selectedSetting.name)}
        </Typography>
        {subText()}
      </View>
      <Divider />
      <View style={styles.subContainer}>{subTitle()}</View>
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
export default SettingsContent;

const styles = StyleSheet.create({
  dropDownStyle: {
    paddingHorizontal: 0,
    borderWidth: 0,
  },
  primaryColor: {
    flex: 0,
    color: theme.colors.primaryColor,
  },
  subTitleStyle: { marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between' },
  subHeaderStyle: { color: theme.colors.darkTint5 },
  divider: { marginBottom: 24 },
  containerStyle: {
    marginHorizontal: 30,
    marginTop: 30,
    marginBottom: 24,
  },
  subContainer: { margin: 30 },
  selectedSettings: { width: '65%' },
});
