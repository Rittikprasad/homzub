import React, { useCallback, memo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Progress } from '@homzhub/common/src/components/atoms/Progress/Progress';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  value: number;
  single?: boolean;
  circle?: boolean;
  title?: string;
  isOverallRating?: boolean;
  onChange?: (rating: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  size?: number;
  isTitleRequired?: boolean;
}

const MULTI_LENGTH = 5;
const Rating = ({
  value = 0,
  single = false,
  circle = false,
  title = '',
  isOverallRating = false,
  onChange,
  containerStyle,
  size = 14,
  isTitleRequired = true,
}: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.property);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const mobileStyle = PlatformUtils.isMobile() ? null : isMobile && styles.widthMobile;

  const ratingColor = useCallback((): string => {
    if (value < 3) {
      return theme.colors.error;
    }
    if (value < 5) {
      return theme.colors.green;
    }
    return theme.colors.gold;
  }, [value]);

  if (circle) {
    return <Progress circle progress={value} wholeFactor={5} filledColor={ratingColor()} title={title} />;
  }

  if (single) {
    return (
      <View style={styles.container}>
        <Label textType="regular" type="large" style={styles.countStyle}>
          {value}
        </Label>
        <Icon name={icons.starFilled} color={ratingColor()} size={14} />
      </View>
    );
  }

  let overallRatingStyle = {};
  let overallRatingText = {};
  if (isOverallRating) {
    overallRatingStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.blueOpacity,
      paddingVertical: 8,
      borderRadius: 20,
    };
    title = t('overallRating');
    overallRatingText = {
      marginEnd: 12,
    };
  }

  return (
    <View
      style={[
        styles.container,
        styles.containerMulti,
        isMobile && styles.containerMultiMobile,
        overallRatingStyle,
        containerStyle,
        isMobile && styles.containerMobile,
      ]}
      pointerEvents={!onChange ? 'none' : 'auto'}
    >
      {isTitleRequired && (
        <Label
          textType="regular"
          type={isOverallRating ? 'regular' : 'large'}
          style={[
            styles.countStyle,
            overallRatingText,
            isOverallRating && isMobile ? styles.widthOverall : mobileStyle,
          ]}
        >
          {title}
        </Label>
      )}
      <View style={styles.starContainer}>
        {[...Array(MULTI_LENGTH)].map((_, index) => (
          <Icon
            key={index}
            name={icons.starFilled}
            size={size}
            color={index < value ? ratingColor() : theme.colors.disabled}
            style={index !== MULTI_LENGTH - 1 && styles.star}
            onPress={(): void => onChange && onChange(index + 1)}
          />
        ))}
      </View>
    </View>
  );
};

const memoized = memo(Rating);
export { memoized as Rating };

const styles = StyleSheet.create({
  container: {
    flexDirection: PlatformUtils.isWeb() ? 'column' : 'row',
    alignItems: 'center',
  },
  containerMobile: {
    flexDirection: 'row',
  },
  containerMultiMobile: {
    justifyContent: 'space-between',
  },
  containerMulti: {
    justifyContent: PlatformUtils.isWeb() ? undefined : 'space-between',
  },
  starContainer: {
    flexDirection: 'row',
  },
  star: {
    marginEnd: 4,
  },
  countStyle: {
    color: theme.colors.darkTint2,
    marginEnd: 4,
  },
  widthMobile: {
    width: 160,
  },
  widthOverall: {
    width: 80,
  },
});
