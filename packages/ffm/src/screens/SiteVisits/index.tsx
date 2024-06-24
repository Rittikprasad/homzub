import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { FFMActions } from '@homzhub/common/src/modules/ffm/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import VisitList from '@homzhub/ffm/src/screens/SiteVisits/VisitList';
import { FFMVisit } from '@homzhub/common/src/domain/models/FFMVisit';
import { IFeedbackParam, ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
import { FFMVisitRoutes, IRoutes, Tabs } from '@homzhub/common/src/constants/Tabs';

const SiteVisitDashboard = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [currentIndex, setIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setIndex(0);
      dispatch(FFMActions.getVisits({ status__in: getStatus(0) }));
      dispatch(FFMActions.clearFeedbackData());
    }, [])
  );

  const onIndexChange = (value: number): void => {
    setIndex(value);
    getData(value);
    dispatch(FFMActions.getVisitsSuccess([]));
  };

  const getStatus = (value: number): string => {
    const currentRoute = FFMVisitRoutes[value];
    switch (currentRoute.key) {
      case Tabs.ONGOING:
      case Tabs.COMPLETED:
        return 'ACCEPTED';
      case Tabs.MISSED:
        return 'PENDING,CANCELLED,REJECTED';
      case Tabs.NEW:
        return 'PENDING';
      default:
        return '';
    }
  };

  const getData = (value: number): void => {
    dispatch(FFMActions.getVisits({ status__in: getStatus(value) }));
  };

  const onReschedule = (visit: FFMVisit): void => {
    dispatch(AssetActions.setVisitIds([visit.id]));
    navigate(ScreenKeys.VisitForm, { startDate: visit.startDate, comment: visit.comments });
  };

  const navigateToDetail = (visitId: number, tab: Tabs): void => {
    navigate(ScreenKeys.VisitDetail, { visitId, tab });
  };

  const navigateToFeedback = (param: IFeedbackParam): void => {
    navigate(ScreenKeys.FeedbackForm, param);
  };

  const renderScene = ({ route }: { route: IRoutes }): React.ReactElement | null => {
    switch (route.key) {
      case Tabs.NEW:
        return (
          <VisitList
            tab={Tabs.NEW}
            status={getStatus(0)}
            onReschedule={onReschedule}
            navigateToFeedback={navigateToFeedback}
            navigateToDetail={(visitId): void => navigateToDetail(visitId, Tabs.NEW)}
          />
        );
      case Tabs.ONGOING:
        return (
          <VisitList
            tab={Tabs.ONGOING}
            status={getStatus(1)}
            onReschedule={onReschedule}
            navigateToFeedback={navigateToFeedback}
            navigateToDetail={(visitId): void => navigateToDetail(visitId, Tabs.ONGOING)}
          />
        );
      case Tabs.MISSED:
        return (
          <VisitList
            tab={Tabs.MISSED}
            status={getStatus(2)}
            onReschedule={onReschedule}
            navigateToFeedback={navigateToFeedback}
            navigateToDetail={(visitId): void => navigateToDetail(visitId, Tabs.MISSED)}
          />
        );
      case Tabs.COMPLETED:
        return (
          <VisitList
            tab={Tabs.COMPLETED}
            status={getStatus(3)}
            onReschedule={onReschedule}
            navigateToFeedback={navigateToFeedback}
            navigateToDetail={(visitId): void => navigateToDetail(visitId, Tabs.COMPLETED)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <GradientScreen screenTitle={t('property:siteVisits')} isUserHeader containerStyle={styles.container}>
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

export default SiteVisitDashboard;

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  tabBar: {
    backgroundColor: theme.colors.white,
    paddingTop: 10,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
});
