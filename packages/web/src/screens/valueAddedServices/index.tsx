import React, { FC, useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import MarketPlaceOverview from '@homzhub/web/src/screens/valueAddedServices/components/MarketPlaceOverview';
import MarketPlaceCollapseCard from '@homzhub/web/src/screens/valueAddedServices/components/MarketPlaceCollapseCard';
import { MetricsCount } from '@homzhub/common/src/domain/models/MetricsCount';

interface IProps {
  propertyAdded: number;
}

const ValueAddedServices: FC<IProps> = ({ propertyAdded }: IProps) => {
  const dispatch = useDispatch();
  const [metricsData, setMetricsData] = useState<MetricsCount>();
  const [metricType, setMetricType] = useState('');
  const { setButtonGrpActions, buttonGrpActions } = useContext(AppLayoutContext);
  const { isClicked } = buttonGrpActions;

  const getManagementData = (): void => {
    ServiceRepository.getServiceManagementTab()
      .then((res) => {
        const { valueAddedService } = res;
        setMetricsData(valueAddedService);
      })
      .catch((e) => AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) }));
  };

  useEffect(() => {
    getManagementData();
    dispatch(UserActions.getUserServices());
  }, []);

  const history = useHistory();

  useEffect(() => {
    if (isClicked) {
      NavigationService.navigate(history, { path: RouteNames.protectedRoutes.SELECT_SERVICES });
    }
    return (): void => {
      setButtonGrpActions({ isClicked: false });
    };
  }, [isClicked]);

  const services = useSelector(UserSelector.getUserServices);

  const onMetricsClicked = (name: string): void => {
    setMetricType(name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerFilters}>
        <MarketPlaceOverview onMetricsClicked={onMetricsClicked} metricData={metricsData} activeMetric={metricType} />
      </View>
      <View style={styles.contentContainer}>
        {services.map((serviceData) => (
          <MarketPlaceCollapseCard serviceData={serviceData} key={serviceData.id} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    marginTop: 24,
    flexDirection: 'column',
  },
  containerFilters: {
    flexDirection: 'row',
    borderRadius: 4,
    paddingBottom: 20,
    minHeight: 40,
    justifyContent: 'space-between',
  },
});

export default ValueAddedServices;
