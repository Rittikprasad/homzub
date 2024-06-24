import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetUpdates } from '@homzhub/common/src/domain/models/AssetMetrics';
import { MetricsCount } from '@homzhub/common/src/domain/models/MetricsCount';
import PropertyUpdatesCard from '@homzhub/web/src/screens/dashboard/components/PropertyUpdates/PropertyUpdatesCard';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IPropertyNotification, IPropertyNotificationDetails } from '@homzhub/common/src/constants/DashBoard';

interface IProp {
  updatesData: AssetUpdates;
}

const getNotificationsData = (data: MetricsCount): IPropertyNotificationDetails[] => [
  {
    label: 'Visits',
    count: data?.siteVisit?.count ?? 0,
    icon: icons.visit,
  },
  {
    label: 'Offer',
    count: data?.offer?.count ?? 0,
    icon: icons.offers,
  },
  {
    label: 'Message',
    count: data?.message?.count ?? 0,
    icon: icons.mail,
  },
];

const ticketsData: IPropertyNotificationDetails[] = [
  {
    label: 'Open',
    count: 0,
    icon: icons.openTemplate,
  },
  {
    label: 'Closed',
    count: 0,
    icon: icons.closeTemplate,
  },
];

const duesData: IPropertyNotificationDetails[] = [
  {
    label: 'Over Due',
    count: 0,
    icon: icons.billPamphlet,
  },
  {
    label: 'Upcoming',
    count: 0,
    icon: icons.billPamphlet,
  },
];

const propertyUpdatesData = (
  notificationCount: number,
  ticketCount: number,
  duesCount: number,
  datum: IPropertyNotificationDetails[]
): IPropertyNotification[] => [
  {
    icon: icons.bell,
    iconColor: theme.colors.green,
    title: 'assetDashboard:notification',
    count: notificationCount,
    details: datum,
    url: RouteNames.protectedRoutes.NOTIFICATIONS,
  },
  {
    icon: icons.serviceRequest,
    iconColor: theme.colors.orange,
    title: 'assetDashboard:tickets',
    // TODO - remove condition once ticket story is picked up.
    count: ticketCount > 0 ? 0 : ticketCount,
    details: ticketsData,
    url: RouteNames.protectedRoutes.DASHBOARD,
  },
  {
    icon: icons.wallet,
    iconColor: theme.colors.danger,
    title: 'assetDashboard:dues',
    // TODO - remove condition once dues story is picked up.
    count: duesCount > 0 ? 0 : duesCount,
    details: duesData,
    url: RouteNames.protectedRoutes.DASHBOARD,
  },
];

const PropertyUpdates: FC<IProp> = ({ updatesData }: IProp) => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyUpdatesStyle(isMobile);
  const datum = getNotificationsData(updatesData?.notifications);
  const data = propertyUpdatesData(
    updatesData?.notifications?.count ?? 0,
    updatesData?.tickets?.count ?? 0,
    updatesData?.dues?.count ?? 0,
    datum
  );

  return (
    <View style={styles.container}>
      {data.map((item, key = 0) => (
        <PropertyUpdatesCard key={item.title} data={item} />
      ))}
    </View>
  );
};

interface IStyle {
  container: ViewStyle;
}

const propertyUpdatesStyle = (isMobile: boolean): StyleSheet.NamedStyles<IStyle> =>
  StyleSheet.create<IStyle>({
    container: {
      flexDirection: isMobile ? 'column' : 'row',
      display: 'flex',
      justifyContent: 'space-between',
    },
  });

export default PropertyUpdates;
