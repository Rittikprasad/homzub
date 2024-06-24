import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { useFocusEffect } from '@react-navigation/native';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import ReportList from '@homzhub/ffm/src/screens/Reports/ReportList';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { FFMVisitRoutes, IRoutes, Tabs } from '@homzhub/common/src/constants/Tabs';

const ReportDashboard = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.reports);
  const { inspectionReport } = useSelector(FFMSelector.getFFMLoaders);
  const isFromDeeplink = useSelector(FFMSelector.getDeeplinkData);
  const [currentIndex, setIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setIndex(0);
      dispatch(FFMActions.getInspectionReport(Tabs.NEW.toLocaleUpperCase()));
    }, [])
  );

  useEffect(() => {
    if (isFromDeeplink) {
      setIndex(1);
      dispatch(FFMActions.getInspectionReport(Tabs.ONGOING.toLocaleUpperCase()));
    }
  }, [isFromDeeplink]);

  const onIndexChange = (value: number): void => {
    const { key } = FFMVisitRoutes[value];
    setIndex(value);
    dispatch(FFMActions.setDeeplinkData(false));
    dispatch(FFMActions.getInspectionReport(key.toLocaleUpperCase()));
  };

  const renderScene = ({ route }: { route: IRoutes }): React.ReactElement => {
    switch (route.key) {
      case Tabs.NEW:
        return <ReportList currentTab={Tabs.NEW} />;
      case Tabs.ONGOING:
        return <ReportList currentTab={Tabs.ONGOING} />;
      case Tabs.MISSED:
        return <ReportList currentTab={Tabs.MISSED} />;
      case Tabs.COMPLETED:
        return <ReportList currentTab={Tabs.COMPLETED} />;
      default:
        return <View />;
    }
  };
  return (
    <GradientScreen
      isUserHeader
      loading={inspectionReport}
      screenTitle={t('reports:reports')}
      containerStyle={styles.container}
    >
      <TabView
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        renderTabBar={(props): React.ReactElement => {
          const {
            navigationState: { index, routes },
          } = props;
          const currentRoute = routes[index];

          return (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={{ backgroundColor: currentRoute.color }}
              renderLabel={({ route }): React.ReactElement => {
                return (
                  <Text type="small" style={styles.tabLabel} numberOfLines={1}>
                    {route.title}
                  </Text>
                );
              }}
            />
          );
        }}
        navigationState={{
          index: currentIndex,
          routes: FFMVisitRoutes,
        }}
      />
    </GradientScreen>
  );
};

export default ReportDashboard;

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  tabBar: {
    backgroundColor: theme.colors.white,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
});
