/**
 * Handling Force Update, Maintenance logic using remote config
 * Doc for ref: https://rnfirebase.io/remote-config/usage
 */

import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';
import { AppModes, ConfigHelper, ConfigModes } from '@homzhub/common/src/utils/ConfigHelper';
import { DeviceUtils } from '@homzhub/common/src/utils/DeviceUtils';
import { Logger } from '@homzhub/common/src/utils/Logger';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import Rocket from '@homzhub/common/src/assets/images/rocket.svg';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';

// Remote config Parameters
enum ConfigKeys {
  MINIMUM_VERSION = 'minimum_version',
  LATEST_VERSION = 'latest_version',
  IS_UNDER_MAINTENANCE = 'is_under_maintenance',
  MESSAGES = 'messages',
}

interface IMessages {
  update: string;
  maintenance: string;
}

interface IConfig {
  [key: string]: any;
}

interface IOwnState {
  isForceUpdate: boolean;
  isUpdateAvailable: boolean;
  isUnderMaintenance: boolean;
  messages: IMessages;
}

const initialState: IOwnState = {
  isForceUpdate: false,
  isUpdateAvailable: false,
  isUnderMaintenance: false,
  messages: {
    update: '',
    maintenance: '',
  },
};

const AppUpdate = (): React.ReactElement => {
  const [configData, setConfigData] = useState<IConfig[]>([]);
  const [configValues, setConfigValues] = useState<IOwnState>(initialState);
  const [isSheetVisible, setVisibility] = useState(false);

  useEffect(() => {
    remoteConfig()
      .setConfigSettings({
        minimumFetchIntervalMillis: 30000, // Global Caching frequency
      })
      .then(() => {
        // Set Default before fetching config from firebase
        remoteConfig()
          .setDefaults({
            is_under_maintenance: false,
            latest_version: '',
            minimum_version: '',
          })
          .then(() => remoteConfig().fetchAndActivate()) // Fetch config and Activate
          .then(() => {
            const config = remoteConfig().getAll(); // Get All config list

            if (config) {
              const formattedData = Object.entries(config).map((item) => {
                const [key, entry] = item as any;
                return {
                  [key]: JSON.parse(entry.asString()),
                };
              });
              setConfigData(formattedData);
            }
          })
          .then(() => remoteConfig().fetch()); // Fetching data for next process
      })

      .catch((e) => {
        Logger.warn(e.message);
      });
  }, []);

  useEffect(() => {
    const updatedData = { ...configValues };
    const configMode = ConfigHelper.getConfigMode();
    const appMode = (configMode === ConfigModes.PROD ? AppModes.RELEASE : AppModes.DEBUG).toLowerCase();

    // Structuring config and maintaining local state to handle UI
    configData.forEach((item) => {
      if (Object.keys(item)[0] === ConfigKeys.MINIMUM_VERSION) {
        updatedData.isForceUpdate = item[ConfigKeys.MINIMUM_VERSION][appMode] > DeviceUtils.appVersion;
      } else if (Object.keys(item)[0] === ConfigKeys.LATEST_VERSION) {
        updatedData.isUpdateAvailable = item[ConfigKeys.LATEST_VERSION][appMode] > DeviceUtils.appVersion;
      } else if (Object.keys(item)[0] === ConfigKeys.IS_UNDER_MAINTENANCE) {
        updatedData.isUnderMaintenance = item[ConfigKeys.IS_UNDER_MAINTENANCE][appMode];
      } else {
        updatedData.messages = item[ConfigKeys.MESSAGES];
      }
    });

    const isVisible = updatedData.isUpdateAvailable || updatedData.isUnderMaintenance || updatedData.isForceUpdate;

    setVisibility(isVisible);
    setConfigValues(updatedData);
  }, [configData]);

  const onUpdateNow = async (): Promise<void> => {
    const { getAppleStoreUrl, getGooglePlayStoreUrl } = ConfigHelper;
    await Linking.openURL(PlatformUtils.isIOS() ? getAppleStoreUrl() : getGooglePlayStoreUrl());
  };

  const { isForceUpdate, messages, isUnderMaintenance, isUpdateAvailable } = configValues;
  const isAlwaysVisible = isForceUpdate || isUnderMaintenance;
  return (
    // <BottomSheet
    //   visible={isSheetVisible}
    //   isShadowView
    //   headerTitle={isUpdateAvailable ? I18nService.t('common:timeToUpdate') : I18nService.t('common:underMaintenance')}
    //   sheetHeight={isUpdateAvailable ? 420 : 300}
    //   isCloseOnDrag={!isAlwaysVisible}
    //   isAlwaysVisible={isAlwaysVisible}
    //   onCloseSheet={(): void => setVisibility(false)}
    // >
    //   <View style={styles.container}>
    //     <Rocket style={styles.iconStyle} />
    //     <Label type="large" style={styles.message}>
    //       {isUpdateAvailable ? messages?.update : messages?.maintenance}
    //     </Label>
    //     {!isUnderMaintenance && (
    //       <Button
    //         type="primary"
    //         title={I18nService.t('common:updateNow')}
    //         containerStyle={styles.updateButton}
    //         onPress={onUpdateNow}
    //       />
    //     )}
    //     {!isAlwaysVisible && (
    //       <Button
    //         type="secondaryOutline"
    //         title={I18nService.t('common:doLater')}
    //         containerStyle={styles.secondaryButton}
    //         textStyle={styles.buttonTitle}
    //         onPress={(): void => setVisibility(false)}
    //       />
    //     )}
    //   </View>
    // </BottomSheet>
    <></>
  );
};

export default AppUpdate;

const styles = StyleSheet.create({
  container: {
    padding: 32,
    flex: 1,
  },
  iconStyle: {
    alignSelf: 'center',
  },
  message: {
    textAlign: 'center',
    marginVertical: 16,
    color: theme.colors.darkTint3,
  },
  updateButton: {
    flex: 0,
    height: 46,
    marginVertical: 10,
  },
  secondaryButton: {
    height: 46,
    flex: 0,
  },
  buttonTitle: {
    color: theme.colors.darkTint3,
  },
});
