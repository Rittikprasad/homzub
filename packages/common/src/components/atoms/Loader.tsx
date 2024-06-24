import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface ILoaderProps {
  visible: boolean;
}

export const Loader = ({ visible }: ILoaderProps): React.ReactElement | null => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.background}>
          <ActivityIndicator
            size={PlatformUtils.isIOS() ? 'large' : 50}
            color={theme.colors.darkTint4}
            style={styles.loader}
          />
          <Label type="regular" textType="regular" style={styles.text}>
            {t('loading')}
          </Label>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 10,
  },
  loader: {
    marginHorizontal: 24,
    marginVertical: 12,
  },
  text: {
    color: theme.colors.darkTint4,
    marginBottom: 12,
  },
});
