import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';

interface IProps {
  iconSize: number;
  onBadgePress: () => void;
  badgesInfo: IBadgeInfo[];
}

interface IBadgeInfo {
  color: string;
}

export const AmenitiesShieldIconGroup: FC<IProps> = ({ onBadgePress, iconSize, badgesInfo }: IProps) => {
  return (
    <View style={styles.badgesContainer}>
      {badgesInfo?.map((item, index) => (
        <Icon
          key={index}
          name={icons.badge}
          size={iconSize}
          color={item.color}
          style={styles.badges}
          onPress={onBadgePress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  badgesContainer: {
    flexDirection: 'row',
  },
  badges: {
    marginHorizontal: PlatformUtils.isWeb() ? 0 : 3,
    marginLeft: PlatformUtils.isWeb() ? 4 : 0,
  },
});
