import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import SettingsContent from '@homzhub/web/src/screens/settings/components/SettingsContent';
import { SettingsData } from '@homzhub/common/src/domain/models/SettingsData';
import { SettingsDropdownValues } from '@homzhub/common/src/domain/models/SettingsDropdownValues';
import { SelectedPreferenceType } from '@homzhub/common/src/domain/models/SettingOptions';
import { UserPreferences, UserPreferencesKeys } from '@homzhub/common/src/domain/models/UserPreferences';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
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
  const [selectedSettingData, setSelectedSettingData] = useState<SettingsData>();
  const settingList = new Array(settingData?.length).fill(false);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const [selected, setSelected] = useState(settingList);
  const [indexActive, setIndexActive] = useState(0);
  const subHeading = [
    {
      title: t('moreProfile:preferenceSubHeading'),
    },
    {
      title: t('moreProfile:dataAndPrivacySubHeading'),
    },
    {
      title: t('moreProfile:communicationSubHeading'),
    },
    {
      title: t('moreProfile:appInfoSubHeading'),
    },
  ];
  const [activeHeading, setActiveHeading] = useState(subHeading[0]);

  useEffect(() => {
    getSettingData().then();
    const selectedSetting = settingList;
    selectedSetting[0] = true;
    setSelected(selectedSetting);
  }, []);

  useEffect(() => {
    getSettingData().then();
  }, [userPreferences]);

  const getSettingData = async (): Promise<void> => {
    try {
      const settingsData = UserRepository.getSettingScreenData();
      const settingDropDownValues = await UserRepository.getSettingDropDownValues();
      const filteredData = settingsData.filter((item) => item.visible === true);
      populateSettingOptions(filteredData, settingDropDownValues);
    } catch (e: any) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  const updateSelectedSetting = (index: number, item: SettingsData): void => {
    const selectedSetting = settingList;
    selectedSetting[index] = true;
    setSelected(selectedSetting);
    setIndexActive(index);
    setSelectedSettingData(item);
  };

  const switchSetting = (index: number, item: SettingsData): void => {
    updateSelectedSetting(index, item);
    setActiveHeading(subHeading[index]);
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
    setSelectedSettingData(settingsData[indexActive]);
    setSettingData(settingsData);
  };

  const updatePreferences = (key: string, value: SelectedPreferenceType): void => {
    const { updateUserPreferences } = props;
    updateUserPreferences({ [key]: value });
  };

  const settingsDataList =
    settingData &&
    settingData.map((item: SettingsData, index) => {
      const title = t(item.name);
      const selectedStyle = { color: selected[index] ? theme.colors.active : theme.colors.darkTint5 };
      return (
        <TouchableOpacity onPress={(): void => switchSetting(index, item)} key={index}>
          <View style={styles.rowStyle}>
            <View style={styles.title}>
              <Icon
                size={18}
                name={item.icon}
                color={selected[index] ? theme.colors.active : theme.colors.darkTint2}
                style={styles.icon}
              />
              <Typography variant="label" fontWeight="semiBold" size="large" style={selectedStyle}>
                {title}
              </Typography>
            </View>

            <Icon
              size={14}
              name={icons.rightArrow}
              color={selected[index] ? theme.colors.active : theme.colors.darkTint2}
            />
          </View>
        </TouchableOpacity>
      );
    });

  return (
    <View style={[styles.container, !isTablet && styles.containerWeb]}>
      <View style={styles.settingList}>
        <View>{settingsDataList}</View>
        <View style={styles.buttonContainer}>
          <Typography variant="label" size="large" style={styles.textStlye}>
            {t('deactivateAccount')}
          </Typography>
        </View>
      </View>
      <Divider containerStyles={styles.divider} />
      <SettingsContent
        updatePreferences={updatePreferences}
        selectedSetting={selectedSettingData}
        activeHeading={activeHeading.title}
      />
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
    backgroundColor: theme.colors.white,
    width: '100%',
    flexDirection: 'row',
    height: '70vh',
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
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingList: {
    marginVertical: 30,
    marginHorizontal: 25,
    width: '28%',
  },
  title: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  icon: { marginRight: 10 },
  buttonContainer: {
    borderWidth: 1,
    height: 45,
    borderColor: theme.colors.darkTint7,
    borderRadius: 4,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  textStlye: {
    color: theme.colors.darkTint7,
    textAlign: 'center',
  },
});
