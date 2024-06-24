import React, { ReactElement } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IUpdateUserPreferences } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/MoreStack';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { RNSwitch } from '@homzhub/common/src/components/atoms/Switch';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { OptionTypes, SelectedPreferenceType, SettingOptions } from '@homzhub/common/src/domain/models/SettingOptions';
import { UserPreferences, UserPreferencesKeys } from '@homzhub/common/src/domain/models/UserPreferences';
import { SettingsData, SettingsDataNameKeys } from '@homzhub/common/src/domain/models/SettingsData';
import { SettingsDropdownValues } from '@homzhub/common/src/domain/models/SettingsDropdownValues';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

type libraryProps = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.SettingsScreen>;

interface IDispatchProps {
  updateUserPreferences: (payload: IUpdateUserPreferences) => void;
}

interface IStateProps {
  userPreferences: UserPreferences;
  isUserPreferencesLoading: boolean;
}

interface IUpdatePayload {
  key: string;
  value: SelectedPreferenceType;
}

interface IBottomSheetDetails {
  title: string;
  message: string;
}

type IOwnProps = libraryProps & IStateProps & IDispatchProps;

interface IOwnState {
  settingsData: SettingsData[];
  isLoading: boolean;
  bottomSheetVisibility: boolean;
  updatePayload: IUpdatePayload;
  bottomSheetDetails: IBottomSheetDetails;
}

class Settings extends React.PureComponent<IOwnProps, IOwnState> {
  public state = {
    settingsData: [],
    isLoading: false,
    bottomSheetVisibility: false,
    updatePayload: {
      key: '',
      value: '',
    },
    bottomSheetDetails: {
      title: '',
      message: '',
    },
  };

  public componentDidMount(): void {
    this.getSettingData().then();
  }

  public async componentDidUpdate(prevProps: Readonly<IOwnProps>): Promise<void> {
    const { userPreferences } = this.props;

    if (userPreferences !== prevProps.userPreferences) {
      await this.getSettingData();
    }
  }

  public render = (): React.ReactNode => {
    const { t, isUserPreferencesLoading } = this.props;
    const { settingsData, isLoading } = this.state;

    return (
      <>
        <UserScreen
          title={t('assetMore:more')}
          pageTitle={t('assetMore:Settings')}
          onBackPress={this.onBackPress}
          loading={isUserPreferencesLoading || isLoading}
        >
          <View style={styles.container}>
            {settingsData.map((item: SettingsData, index) => {
              return (
                <React.Fragment key={index}>
                  {item.visible ? this.renderTitle(item, index < settingsData.length - 1) : null}
                </React.Fragment>
              );
            })}
          </View>
        </UserScreen>
        {this.renderBottomSheet()}
      </>
    );
  };

  private renderBottomSheet = (): ReactElement => {
    const {
      bottomSheetVisibility,
      bottomSheetDetails: { title, message },
    } = this.state;
    const { t } = this.props;

    return (
      <BottomSheet
        visible={bottomSheetVisibility}
        headerTitle={title}
        sheetHeight={350}
        onCloseSheet={this.onSheetClose}
      >
        <View style={styles.bottomSheet}>
          <Text type="small" style={styles.message}>
            {message}
          </Text>
          <Text type="small">{t('common:wantToContinue')}</Text>
          <View style={styles.buttonContainer}>
            <Button
              type="secondary"
              title={t('common:continue')}
              titleStyle={styles.buttonTitle}
              onPress={this.updatePreferences}
              containerStyle={styles.editButton}
            />
            <Button
              type="primary"
              title={t('common:cancel')}
              onPress={this.onSheetClose}
              titleStyle={styles.buttonTitle}
              containerStyle={styles.doneButton}
            />
          </View>
        </View>
      </BottomSheet>
    );
  };

  private renderTitle = (info: SettingsData, showDivider: boolean): ReactElement => {
    const { t } = this.props;
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
              {this.renderSubTitle(title, option, index < info.options.length - 1)}
            </React.Fragment>
          );
        })}
        {showDivider && <Divider containerStyles={styles.titleDividerStyles} />}
      </>
    );
  };

  private renderSubTitle = (title: string, options: SettingOptions, showDivider: boolean): ReactElement => {
    const { t } = this.props;

    return (
      <>
        <TouchableOpacity
          style={[styles.rowStyle, styles.subTitleView]}
          disabled={options.type !== OptionTypes.Webview}
          onPress={(): void => this.navigateToWebview(options.url)}
        >
          <Label style={styles.subTitle} type="large">
            {t(options.label)}
          </Label>
          {this.renderOptionTypes(title, options)}
        </TouchableOpacity>
        {showDivider && (
          <View style={styles.paddingLeft}>
            <Divider />
          </View>
        )}
      </>
    );
  };

  private renderOptionTypes = (title: string, options: SettingOptions): ReactElement => {
    let renderElement: ReactElement;
    let navigateToWebview: () => void;
    const handleChange = (value: SelectedPreferenceType): void =>
      this.handlePreferenceUpdate(title, options.name, value);

    switch (options.type) {
      case OptionTypes.Webview:
        navigateToWebview = (): void => this.navigateToWebview(options.url);

        renderElement = (
          <Icon size={20} name={icons.rightArrow} color={theme.colors.primaryColor} onPress={navigateToWebview} />
        );
        break;
      case OptionTypes.Dropdown:
        renderElement = (
          <Dropdown
            data={options.options}
            value={options.selected as string}
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

  private onBackPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private onSheetClose = (): void => {
    this.setState({ bottomSheetVisibility: false });
  };

  private handlePreferenceUpdate = (title: string, key: string, value: SelectedPreferenceType): void => {
    const {
      IsEmailObfuscated,
      IsLastNameObfuscated,
      IsMobileNumberObfuscated,
      PushNotifications,
      EmailsText,
      MessagesText,
    } = UserPreferencesKeys;

    const enableBottomSheet =
      key === IsEmailObfuscated || key === IsLastNameObfuscated || key === IsMobileNumberObfuscated;

    const enableCommunicationsBottomSheet =
      (key === PushNotifications || key === EmailsText || key === MessagesText) && !value;

    let updatedValue = value;
    if (enableBottomSheet) {
      updatedValue = !value;
    }

    this.setState(
      (prevState) => ({
        ...prevState,
        updatePayload: { key, value: updatedValue },
        ...((enableCommunicationsBottomSheet || enableBottomSheet) && { bottomSheetVisibility: true }),
        ...((enableCommunicationsBottomSheet || enableBottomSheet) && {
          bottomSheetDetails: { title, message: this.getCautionMessageFor(key, value) },
        }),
      }),
      () => {
        if (!enableBottomSheet && !enableCommunicationsBottomSheet) {
          this.updatePreferences();
        }
      }
    );
  };

  private getCautionMessageFor = (key: string, value: SelectedPreferenceType): string => {
    const { t } = this.props;
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

  private updatePreferences = (): void => {
    const { updateUserPreferences } = this.props;
    const {
      updatePayload: { key, value },
      bottomSheetVisibility,
    } = this.state;

    if (bottomSheetVisibility) {
      this.onSheetClose();
    }
    updateUserPreferences({ [key]: value });
  };

  private navigateToWebview = (url: string): void => {
    const {
      navigation: { navigate },
    } = this.props;

    // @ts-ignore
    navigate(ScreensKeys.WebViewScreen, { url });
  };

  private getSettingData = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const settingsData = UserRepository.getSettingScreenData();
      const settingDropDownValues = await UserRepository.getSettingDropDownValues();

      this.populateSettingOptions(settingsData, settingDropDownValues);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  private populateSettingOptions = (
    settingsData: SettingsData[],
    settingDropDownValues: SettingsDropdownValues
  ): void => {
    const { userPreferences } = this.props;

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

    this.setState({ settingsData });
  };
}

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.moreSettings)(Settings));

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 8,
    backgroundColor: theme.colors.white,
  },
  rowStyle: {
    flexDirection: 'row',
    paddingHorizontal: theme.layout.screenPadding,
  },
  subTitleView: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginLeft: 8,
    marginBottom: 8,
    color: theme.colors.darkTint2,
  },
  subTitle: {
    marginVertical: 16,
    marginLeft: 8,
    color: theme.colors.darkTint4,
  },
  titleDividerStyles: {
    borderColor: theme.colors.moreSeparator,
    borderWidth: 10,
    marginBottom: 16,
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
  message: {
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
    height: 50,
  },
  doneButton: {
    flexDirection: 'row-reverse',
    height: 50,
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
  bottomSheet: {
    paddingHorizontal: theme.layout.screenPadding,
  },
});
