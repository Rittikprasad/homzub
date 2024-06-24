import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const Footer: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const textType = isMobile ? 'small' : 'large';
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={styles.leftOptionsFooter}>
        <Label type={textType} textType="regular" style={styles.copyrightText}>
          {t('copyrightContent')}
        </Label>
        <Label type={textType} textType="semiBold" style={styles.linkText}>
          {t('homzhubLink')}
        </Label>
      </View>
      <View style={styles.rightOptionsFooter}>
        <View style={styles.optionTerm}>
          <Label type={textType} textType="semiBold" style={styles.linkText}>
            {t('terms')}
          </Label>
        </View>
        <Label type={textType} textType="semiBold" style={styles.linkText}>
          {t('privacy')}
        </Label>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    bottom: '0%',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: theme.colors.darkTint9,
    minHeight: '81px',
    paddingVertical: '2%',
    paddingHorizontal: '3%',
  },
  containerMobile: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftOptionsFooter: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  copyrightText: {
    color: theme.colors.darkTint6,
  },
  linkText: {
    color: theme.colors.blue,
  },
  rightOptionsFooter: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  optionTerm: {
    marginRight: 42,
  },
});
