import React from 'react';
import { StyleSheet, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  primaryAddress: string;
  isIcon?: boolean;
  subAddress: string;
  primaryTextType?: TextSizeType;
  primaryAddressStyle?: StyleProp<TextStyle>;
  subAddressStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const PropertyAddress = (props: IProps): React.ReactElement => {
  const {
    primaryAddress,
    subAddress,
    primaryAddressStyle,
    subAddressStyle,
    isIcon,
    primaryTextType = 'regular',
    containerStyle = {},
  } = props;
  return (
    <View style={[styles.propertyAddressContainer, containerStyle]}>
      <Text
        type={primaryTextType}
        textType="semiBold"
        style={[styles.propertyNameText, primaryAddressStyle]}
        numberOfLines={1}
      >
        {primaryAddress}
      </Text>
      <View style={styles.flexRow}>
        {isIcon && <Icon name={icons.locationMarker} size={24} color={theme.colors.darkTint3} />}
        <Label
          type="large"
          textType="regular"
          numberOfLines={3}
          style={[styles.subAddress, isIcon && styles.subAddressMargin, subAddressStyle]}
        >
          {subAddress}
        </Label>
      </View>
    </View>
  );
};

export { PropertyAddress };

const styles = StyleSheet.create({
  propertyAddressContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  propertyNameText: {
    flex: 1,
    color: theme.colors.shadow,
    justifyContent: 'center',
    alignItems: 'center',
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
  subAddressMargin: {
    marginHorizontal: 10,
  },
});
