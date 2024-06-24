import React, { useState } from 'react';
import { StyleSheet, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { TextFieldType, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AmenitiesShieldIconGroup } from '@homzhub/common/src/components/molecules/AmenitiesShieldIconGroup';

interface IProps {
  propertyType?: string;
  isInfoRequired?: boolean;
  propertyTypeStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textType?: TextFieldType;
  textSize?: TextSizeType;
}

const ShieldGroup = ({
  propertyType,
  textType = 'text',
  textSize = 'small',
  isInfoRequired,
  propertyTypeStyle,
  containerStyle,
}: IProps): React.ReactElement => {
  const [isVisible, setVisible] = useState(false);

  const handleInfo = (): void => {
    setVisible(isInfoRequired ? !isVisible : false);
  };

  const customStyle = customizedStyles(!!propertyType);
  const badgeInfo = [
    { color: theme.colors.warning },
    { color: theme.colors.warning },
    { color: theme.colors.disabledPreference },
  ];
  return (
    <View style={[customStyle.container, containerStyle]}>
      {!!propertyType && (
        <Typography variant={textType} size={textSize} style={[styles.propertyTypeText, propertyTypeStyle]}>
          {propertyType}
        </Typography>
      )}
      <AmenitiesShieldIconGroup onBadgePress={handleInfo} iconSize={23} badgesInfo={badgeInfo} />
    </View>
  );
};

export { ShieldGroup };

const styles = StyleSheet.create({
  propertyTypeText: {
    color: theme.colors.primaryColor,
  },
  flexOne: {
    flex: 1,
  },
  markdownText: {
    padding: theme.layout.screenPadding,
  },
});

interface IStyle {
  container: ViewStyle;
}
const customizedStyles = (isWithText: boolean): IStyle => ({
  container: {
    flexDirection: isWithText ? 'row' : 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 0,
  },
});
