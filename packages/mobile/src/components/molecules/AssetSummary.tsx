import React, { useState, useEffect } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  notification?: number;
  serviceTickets?: number;
  dues?: number;
  messages?: number;
  jobs?: number;
  isFFM?: boolean;
  onPressNotification?: () => void;
  onPressServiceTickets?: () => void;
  onPressDue?: () => void;
  onPressMessages?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

interface IItem {
  icon: string;
  color: string;
  title: string;
  onPress?: () => void;
  count: number;
}

const AssetSummary = (props: IProps): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);
  const {
    notification = 0,
    serviceTickets = 0,
    dues = 0,
    messages = 0,
    jobs = 0,
    isFFM = false,
    containerStyle,
    onPressDue,
    onPressNotification,
    onPressServiceTickets,
    onPressMessages,
  } = props;

  // Data for the static part of the component
  const [data, setData] = useState<IItem[]>([]);
  useEffect(() => {
    setData([
      {
        icon: icons.alert,
        color: theme.colors.notificationGreen,
        title: t('notification'),
        onPress: onPressNotification,
        count: notification,
      },
      {
        icon: icons.serviceRequest,
        color: theme.colors.orange,
        title: t('assetMore:tickets'),
        onPress: onPressServiceTickets,
        count: serviceTickets,
      },
      {
        icon: icons.chat,
        color: isFFM ? theme.colors.danger : theme.colors.blue,
        title: isFFM ? t('Jobs') : t('moreSettings:messagesText'),
        onPress: onPressMessages,
        count: isFFM ? jobs : messages,
      },
    ]);
  }, [
    dues,
    notification,
    messages,
    serviceTickets,
    onPressDue,
    onPressNotification,
    onPressServiceTickets,
    onPressMessages,
    t,
  ]);

  return (
    <LinearGradient
      useAngle
      angle={180}
      colors={[theme.colors.white, theme.colors.background]}
      locations={[0, 1]}
      style={[styles.container, containerStyle]}
    >
      {data.map((item, index) => {
        const { icon, title, color, count, onPress } = item;
        return (
          <TouchableOpacity
            key={title}
            style={[styles.item, index !== data.length - 1 && styles.divider]}
            onPress={onPress}
          >
            <Icon name={icon} color={color} size={25} />
            <Text type="small" textType="semiBold" style={{ color }} numberOfLines={1}>
              {title}
            </Text>
            <Text type="regular" textType="bold" style={{ color }}>
              {count}
            </Text>
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
};

export { AssetSummary };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
  },
  item: {
    flex: 0.33,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  divider: {
    borderEndWidth: 1.5,
    borderEndColor: theme.colors.disabled,
  },
});
