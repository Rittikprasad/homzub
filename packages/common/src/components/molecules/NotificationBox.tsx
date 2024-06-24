import React from 'react';
import { FlatList, Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { TimeUtils } from '@homzhub/common/src/utils/TimeUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { SVGUri } from '@homzhub/common/src/components/atoms/Svg';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Notifications } from '@homzhub/common/src/domain/models/AssetNotifications';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  data: Notifications[];
  onPress: (data: Notifications) => void;
  shouldEnableOuterScroll?: (scrollEnabled: boolean) => void;
  onLoadMore: () => void;
  unreadCount: number;
  isTitle?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  isTablet?: boolean;
}

const NotificationBox = (props: IProps): React.ReactElement => {
  const {
    data,
    onPress,
    isTitle = true,
    containerStyle,
    unreadCount,
    onLoadMore,
    shouldEnableOuterScroll,
    isTablet,
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);

  const renderItem = ({ item }: { item: Notifications }): React.ReactElement => {
    let notificationStyle = {};

    if (!item.isRead) {
      notificationStyle = styles.unreadNotification;
    } else {
      notificationStyle = {
        borderColor: theme.colors.darkTint10,
        borderWidth: 1,
      };
    }

    const onBubblePress = (): void => {
      onPress(item);
    };

    return (
      <TouchableOpacity style={[styles.container, notificationStyle]} onPress={onBubblePress}>
        {isTitle && (
          <Label type="large" textType="semiBold">
            {PlatformUtils.isWeb() ? item.title : StringUtils.truncateByChars(item.title, 80)}
          </Label>
        )}
        <View style={styles.infoContainer}>
          <View style={styles.initialsContainer}>
            {PlatformUtils.isWeb() ? (
              <Image source={{ uri: item.notificationType.attachmentLink }} style={styles.notificationIcon} />
            ) : (
              <SVGUri uri={item.notificationType.attachmentLink} width={25} height={20} />
            )}
          </View>
          <View style={styles.description}>
            <View style={styles.nameAndTimeContainer}>
              <Label type="regular" textType="regular" style={styles.labels}>
                {item.notificationType.label}
              </Label>
              <Label type="regular" textType="regular" style={styles.labels}>
                {TimeUtils.getLocaltimeDifference(item.createdAt)}
              </Label>
            </View>
            <Label type="large" textType="regular" style={styles.descriptionText}>
              {PlatformUtils.isWeb() ? item.message : StringUtils.truncateByChars(item.message, 255)}
            </Label>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: Notifications, index: number): string => index.toString();

  return (
    <View style={[styles.notificationsContainer, containerStyle]}>
      <Label type="large" textType="regular" style={styles.notificationsCount}>
        {t('newNotification', { count: unreadCount })}
      </Label>
      <FlatList
        key={
          PlatformUtils.isWeb()
            ? isTablet
              ? 'Notification-List-Tab'
              : 'Notification-List-Web'
            : 'Notification-List-App'
        }
        data={data}
        renderItem={renderItem}
        initialNumToRender={10}
        numColumns={PlatformUtils.isWeb() ? (isTablet ? 1 : 2) : 1}
        showsVerticalScrollIndicator={false}
        onTouchStart={(): void => {
          if (shouldEnableOuterScroll) {
            shouldEnableOuterScroll(true);
          }
        }}
        onMomentumScrollEnd={(): void => {
          if (shouldEnableOuterScroll) {
            shouldEnableOuterScroll(true);
          }
        }}
        keyExtractor={keyExtractor}
        onEndReached={({ distanceFromEnd }: { distanceFromEnd: number }): void => {
          if (distanceFromEnd > 0) {
            onLoadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        nestedScrollEnabled
      />
    </View>
  );
};

const memoizedComponent = React.memo(NotificationBox);
export { memoizedComponent as NotificationBox };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 100,
    marginVertical: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    marginHorizontal: PlatformUtils.isWeb() ? 12 : undefined,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  initialsContainer: {
    ...(theme.circleCSS(40) as object),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    backgroundColor: theme.colors.reminderBackground,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  description: {
    justifyContent: 'center',
    flex: 1,
    marginStart: 10,
  },
  nameAndTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  unreadNotification: {
    backgroundColor: theme.colors.unreadNotification,
  },
  notificationsContainer: {
    flex: 1,
    padding: theme.layout.screenPadding,
  },
  notificationsCount: {
    color: theme.colors.darkTint6,
  },
  labels: {
    color: theme.colors.darkTint3,
  },
  descriptionText: {
    color: theme.colors.darkTint2,
  },
  notificationIcon: {
    width: 25,
    height: 25,
  },
});
