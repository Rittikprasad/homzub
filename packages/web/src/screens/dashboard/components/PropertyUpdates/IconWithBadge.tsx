import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Badge } from '@homzhub/common/src/components/atoms/Badge';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  label: string;
  count: number;
  icon: string;
  iconSize?: number;
  badgeColor: string;
  textStyle?: StyleProp<ViewStyle>;
  badgeStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const IconWithBadge = (props: IProps): React.ReactElement => {
  const { containerStyle, label, icon, badgeColor, count } = props;
  const isTablet = useDown(deviceBreakpoint.TABLET);
  return (
    <View style={containerStyle}>
      <View style={styles.iconNotification}>
        <Icon name={icon} size={20} style={styles.icon} />
        <Badge title={count < 100 ? `${count}` : '99+'} badgeColor={badgeColor} badgeStyle={styles.badge} />
      </View>
      {!isTablet && (
        <Label type="regular" textType="regular" minimumFontScale={0.5} style={styles.label}>
          {label}
        </Label>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconNotification: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    position: 'absolute',
  },
  badge: {
    position: 'relative',
    transform: [
      {
        translateX: 15,
      },
      {
        translateY: -10,
      },
    ],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  label: {
    color: theme.colors.darkTint3,
  },
});
export default IconWithBadge;
