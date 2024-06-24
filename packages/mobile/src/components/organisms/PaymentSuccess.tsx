import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { MarkdownType } from '@homzhub/mobile/src/navigation/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  onClickLink: (markdownKey: MarkdownType) => void;
  onPreviewPropertyPress?: () => void;
}

export const PaymentSuccess = (props: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const { onClickLink, onPreviewPropertyPress } = props;
  const handleLink = (): void => onClickLink('visit');
  return (
    <View style={styles.container}>
      <View style={styles.doneView}>
        <Icon name={icons.circularCheckFilled} color={theme.colors.completed} size={28} />
        <Text type="large" style={styles.doneMsg}>
          {t('common:allDone')}
        </Text>
      </View>
      <Text type="small" style={styles.successMsg}>
        {t('paymentSuccessful')}
      </Text>
      <Divider />
      <Text type="regular" style={styles.info}>
        {t('reviewProperty')}
      </Text>
      <Text type="small" style={styles.callInfo}>
        {t('expectCall')}
      </Text>
      <Text type="small" textType="semiBold" style={styles.helperText}>
        {t('visitInfo')}
        <Text type="small" textType="semiBold" style={styles.linkText} onPress={handleLink} testID="txtPress">
          {t('common:why')}
        </Text>
      </Text>
      {onPreviewPropertyPress ? (
        <View style={styles.shadowView}>
          <Button
            type="primary"
            title={t('previewProperty')}
            containerStyle={styles.buttonStyle}
            onPress={onPreviewPropertyPress}
          />
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  doneView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  doneMsg: {
    color: theme.colors.darkTint1,
    marginLeft: 12,
    marginTop: 8,
  },
  successMsg: {
    color: theme.colors.darkTint3,
    marginTop: 6,
    marginBottom: 24,
  },
  info: {
    color: theme.colors.darkTint2,
    marginTop: 16,
    marginBottom: 24,
  },
  callInfo: {
    color: theme.colors.darkTint3,
    marginBottom: 38,
  },
  helperText: {
    color: theme.colors.darkTint2,
    marginTop: 16,
  },
  linkText: {
    color: theme.colors.primaryColor,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
});
