import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ITypographyProps, Typography } from '@homzhub/common/src/components/atoms/Typography';

interface IProps {
  primaryAddress: string;
  isIcon?: boolean;
  subAddress?: string;
  propertyType?: string;
  countryFlag: React.ReactElement | null;
  primaryAddressTextStyles?: ITypographyProps;
  subAddressTextStyles?: ITypographyProps;
  primaryAddressStyle?: StyleProp<TextStyle>;
  subAddressStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showAddress?: boolean;
}

const PropertyAddressCountry = (props: IProps): React.ReactElement => {
  const {
    primaryAddress,
    subAddress,
    primaryAddressTextStyles,
    subAddressTextStyles,
    primaryAddressStyle,
    subAddressStyle,
    containerStyle = {},
    countryFlag,
    isIcon,
    showAddress = true,
    propertyType,
  } = props;
  return (
    <View style={[styles.propertyAddressContainer, containerStyle]}>
      {!!propertyType && (
        <Typography variant="label" size="large" fontWeight="regular" style={[styles.propertyType]} numberOfLines={1}>
          {propertyType}
        </Typography>
      )}
      <View style={styles.flexRow}>
        {countryFlag}
        <Typography
          variant={primaryAddressTextStyles?.variant ?? 'text'}
          size={primaryAddressTextStyles?.size ?? 'regular'}
          fontWeight={primaryAddressTextStyles?.fontWeight ?? 'semiBold'}
          style={[styles.propertyNameText, primaryAddressStyle]}
          numberOfLines={1}
        >
          {primaryAddress}
        </Typography>
      </View>
      {showAddress && !!subAddress && (
        <View style={styles.flexRow}>
          {isIcon && <Icon name={icons.locationMarker} size={16} color={theme.colors.darkTint3} style={styles.icon} />}
          <Typography
            variant={subAddressTextStyles?.variant ?? 'text'}
            size={subAddressTextStyles?.size ?? 'small'}
            fontWeight={subAddressTextStyles?.fontWeight ?? 'regular'}
            style={[styles.subAddress, subAddressStyle]}
            numberOfLines={2}
          >
            {subAddress}
          </Typography>
        </View>
      )}
    </View>
  );
};

export { PropertyAddressCountry };

const styles = StyleSheet.create({
  propertyAddressContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  propertyNameText: {
    color: theme.colors.shadow,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subAddress: {
    flex: 1,
    color: theme.colors.darkTint3,
    marginVertical: 6,
  },
  flagStyle: {
    borderRadius: 2,
    width: 24,
    height: 24,
  },
  icon: {
    marginEnd: 9,
  },
  propertyType: {
    color: theme.colors.primaryColor,
    marginBottom: 6,
  },
});
