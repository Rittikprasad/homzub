import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useDown, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NotificationService } from '@homzhub/common/src/services/NotificationService';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { NotificationBox } from '@homzhub/common/src/components/molecules/NotificationBox';
import { IOverviewCarousalData } from '@homzhub/web/src/components/molecules/OverviewCarousel';
import InfiniteScrollView from '@homzhub/web/src/components/hoc/InfiniteScroll';
import NotificationHeader from '@homzhub/web/src/screens/notifications/components/NotificationHeader';
import { AssetNotifications, Notifications } from '@homzhub/common/src/domain/models/AssetNotifications';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { MetricsCount } from '@homzhub/common/src/domain/models/MetricsCount';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IPropertyNotificationDetails } from '@homzhub/common/src/constants/DashBoard';

// TODO: Remove after API integration
const getNotificationsData = (data: MetricsCount): IPropertyNotificationDetails[] => [
  {
    label: 'Site visits',
    count: data?.siteVisit?.count ?? 0,
    iconColor: '#FFFFFF',
    colorCode: 'rgba(255, 113, 68, 1)',
    imageBackgroundColor: 'rgba(255, 127, 87, 1)',
    icon: icons.visit,
  },
  {
    label: 'Offers',
    count: data?.offer?.count ?? 0,
    iconColor: '#FFFFFF',
    colorCode: 'rgba(44, 186, 103, 1)',
    imageBackgroundColor: 'rgba(56, 205, 118, 1)',
    icon: icons.offers,
  },
  {
    label: 'Messages',
    count: data?.message?.count ?? 0,
    iconColor: '#FFFFFF',
    colorCode: 'rgba(198, 142, 58, 1)',
    imageBackgroundColor: 'rgba(211, 159, 80, 1)',
    icon: icons.mail,
  },
];

const Notification: FC = () => {
  const [notifications, setNotifications] = useState({} as AssetNotifications);
  const [notificationsArray, setNotificationsArray] = useState<Notifications[]>([]);
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [portfolioMetrics, setPortfolioMetrics] = useState<IOverviewCarousalData[]>([]);
  const [countMetrics, setCountMetrics] = useState(0);
  const hasMore = !(notificationsArray?.length >= notifications.count);

  const transformData = (arrayObject: IPropertyNotificationDetails[]): IOverviewCarousalData[] => {
    const newArrayOfObj = arrayObject.map(({ label, colorCode, count, ...rest }) => ({
      label,
      colorCode,
      count,
      ...rest,
    }));
    return newArrayOfObj as IOverviewCarousalData[];
  };

  const notificationsMetrics = (datum: MetricsCount): IPropertyNotificationDetails[] => {
    setCountMetrics(datum.count);
    return getNotificationsData(datum);
  };

  const getPorfolioMetrics = async (callback: (response: AssetMetrics) => void): Promise<void> => {
    try {
      const response: AssetMetrics = await DashboardRepository.getAssetMetrics();
      callback(response);
    } catch (e: any) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };

  const getUpdatedMetrics = (): void => {
    getPorfolioMetrics((response) =>
      setPortfolioMetrics(transformData(notificationsMetrics(response.updates?.notifications)))
    ).then();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getUpdatedMetrics();
  }, []);

  const getNotification = async (): Promise<void> => {
    const searchText = '';
    const requestPayload = {
      limit,
      offset,
      ...(searchText.length > 0 ? { q: searchText } : {}),
    };
    try {
      setLoading(true);
      const response = await DashboardRepository.getAssetNotifications(requestPayload);
      setNotifications(response);
      setNotificationsArray((prevState: Notifications[]) =>
        prevState !== notificationsArray ? [...prevState, ...response.results] : [...prevState]
      );
      setOffset(offset + response.results.length);
      setLoading(false);
    } catch (e: any) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      setLoading(false);
    }
  };

  const getInitNotification = async (): Promise<void> => {
    const searchText = '';
    const requestPayload = {
      limit,
      offset,
      ...(searchText.length > 0 ? { q: searchText } : {}),
    };
    try {
      const response = await DashboardRepository.getAssetNotifications(requestPayload);
      setNotifications(response);
      setNotificationsArray((prevState: Notifications[]) =>
        prevState !== notificationsArray ? [...prevState, ...response.results] : [...prevState]
      );
      setOffset(response.results.length);
    } catch (e: any) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  const onMetricsClicked = (name: string): void => {
    if (filterName === name) {
      name = '';
    }
    setFilterName(name);
  };

  const filterData = (): Notifications[] => {
    const data = filterName
      ? (notificationsArray ?? []).filter((item) => item.notificationType.label === filterName)
      : notificationsArray;
    return data;
  };

  useEffect(() => {
    if (!notificationsArray.length) {
      getInitNotification();
    }
  }, []);

  const onNotificationClicked = async (data: Notifications): Promise<void> => {
    const { id, isRead } = data;
    if (!isRead) {
      await DashboardRepository.updateNotificationStatus(id);
      const index = notificationsArray.findIndex((el: Notifications) => el.id === id);
      const tempArray: Notifications[] = cloneDeep(notificationsArray);
      const updatedNotifications = notificationsArray[index];
      updatedNotifications.isRead = true;
      tempArray[index] = updatedNotifications;
      getUpdatedMetrics();
      setNotificationsArray(tempArray);
      setNotifications(NotificationService.getUpdatedNotifications(id, notifications));
    }
  };
  const { t } = useTranslation();
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const isTab = useDown(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <NotificationHeader
        onMetricsClicked={onMetricsClicked}
        portfolioMetrics={portfolioMetrics}
        countMetrics={countMetrics}
      />
      <InfiniteScrollView
        data={notifications?.count}
        fetchMoreData={(): Promise<void> => getNotification()}
        height={isDesktop ? '600px' : '150vh'}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
        }}
        hasMore={hasMore}
        limit={limit}
        loader={loading}
      >
        <View style={styles.bodyContainer}>
          {notifications && notificationsArray.length && filterData().length > 0 ? (
            <NotificationBox
              data={filterData()}
              onPress={onNotificationClicked}
              unreadCount={countMetrics}
              shouldEnableOuterScroll={FunctionUtils.noop}
              onLoadMore={FunctionUtils.noop}
              isTablet={isTab}
            />
          ) : (
            <EmptyState title={t('propertySearch:noResultsTitle')} containerStyle={styles.emptyState} />
          )}
        </View>
      </InfiniteScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
  },
  emptyState: {
    height: '60vh',
  },
});

export default Notification;
