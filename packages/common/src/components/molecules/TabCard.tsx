import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface ICardProp {
  title: string;
  icon?: string;
  iconColor?: string;
  badge?: number;
  image?: React.ReactElement;
  onPressCard: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const TabCard = (props: ICardProp): React.ReactElement => {
  const {
    containerStyle,
    badge,
    onPressCard,
    title,
    icon = icons.portfolio,
    iconColor = theme.colors.darkTint5,
    image,
  } = props;

  return (
    <TouchableOpacity style={[styles.container, containerStyle, !badge && styles.padding]} onPress={onPressCard}>
      {!!badge && badge > 0 && (
        <View style={styles.badge}>
          <Label type="large">{badge}</Label>
        </View>
      )}
      <View style={styles.content}>
        {image || <Icon name={icon} size={34} color={iconColor} />}
        <Label type="large" style={styles.title}>
          {title}
        </Label>
      </View>
    </TouchableOpacity>
  );
};

export default TabCard;

const styles = StyleSheet.create({
  container: {
    flexBasis: '30%',
    backgroundColor: theme.colors.white,
    marginBottom: 16,
    borderRadius: 10,
  },
  badge: {
    height: 20,
    width: 20,
    borderRadius: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    backgroundColor: theme.colors.redOpacity,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  title: {
    marginTop: 12,
    color: theme.colors.gray15,
    textAlign: 'center',
  },
  padding: {
    paddingTop: 20,
  },
});
