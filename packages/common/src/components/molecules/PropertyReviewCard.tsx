import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Property from '@homzhub/common/src/assets/images/property.svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const PropertyReviewCard = ({ containerStyle }: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={PlatformUtils.isWeb() && styles.propertyContainer}>
        <Property />
      </View>
      <View style={PlatformUtils.isWeb() && styles.subContainer}>
        <Text type="small" textType="semiBold" style={[styles.heading, PlatformUtils.isWeb() && styles.headingWeb]}>
          {t('reviewingProperty')}
        </Text>
        <Label type="large" style={[styles.subHeading, PlatformUtils.isWeb() && styles.headingWeb]}>
          {t('executivesCall')}
        </Label>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.reviewCardOpacity,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  subContainer: {
    flex: 0.9,
  },
  heading: {
    marginTop: 12,
    color: theme.colors.darkTint3,
    textAlign: 'center',
  },
  headingWeb: {
    textAlign: 'auto',
  },
  subHeading: {
    textAlign: 'center',
    marginTop: 6,
    color: theme.colors.darkTint3,
  },
  propertyContainer: {
    flex: 0.2,
  },
});
