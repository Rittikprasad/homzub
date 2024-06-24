import React, { FC } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Email from '@homzhub/common/src/assets/images/email.svg';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  isFromLogin: boolean;
  // onEmailLogin?: () => void;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const CommonAuthenticationHoc: FC<IProps> = ({ isFromLogin, onEmailLogin, containerStyle, children }: IProps) => {
  const { t } = useTranslation();
  const titlePrefix = isFromLogin ? t('auth:socialButtonPrefixLogin') : t('auth:socialButtonPrefixSignUp');
  return (
    <View style={[styles.buttonContainer, containerStyle]}>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Label style={styles.labelText} type="large" textType="regular">
          or {titlePrefix}
        </Label>
        <View style={styles.line} />
      </View>
      <View style={styles.iconContainer}>
        {onEmailLogin && (
          <TouchableOpacity style={styles.alignToCenter} onPress={onEmailLogin}>
            <Email height={24} width={24} />
            <Label type="regular" textType="regular" style={styles.iconTextStyle}>
              {t('auth:emailText')}
            </Label>
          </TouchableOpacity>
        )}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: theme.layout.screenPadding,
  },
  lineContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 24,
  },
  line: {
    backgroundColor: theme.colors.darkTint9,
    height: 1,
    flex: 1,
    alignSelf: 'center',
  },
  labelText: {
    alignSelf: 'center',
    paddingHorizontal: 5,
    color: theme.colors.darkTint5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconTextStyle: {
    marginTop: 4,
  },
  alignToCenter: {
    alignItems: 'center',
  },
});

export default CommonAuthenticationHoc;
