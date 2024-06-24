import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  onPressLink: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const PrivacyPolicy = (props: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const { onPressLink, containerStyle = {} } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <Label type="regular" style={styles.text}>
        <Label type="regular" style={styles.inLineText} onPress={onPressLink}>
          {t('moreSettings:privacyPolicyText')}
        </Label>
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    color: theme.colors.darkTint5,
  },
  inLineText: {
    color: theme.colors.primaryColor,
  },
});
