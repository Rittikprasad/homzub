import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle, View, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { AssetSummary } from '@homzhub/mobile/src/components/molecules/AssetSummary';
import { AssetMetricsList } from '@homzhub/mobile/src/components/organisms/AssetMetricsList';
import HotPropertiesTab from '@homzhub/ffm/src/screens/Dashboard/HotProperties/HotPropertiesTab';
import { FFMMetrics } from '@homzhub/common/src/domain/models/FFMMetrics';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';
// setChangeStack
const Dashboard = (): React.ReactElement => {
  const { t } = useTranslation();
  const { navigate, replace } = useNavigation();
  const { hotProperties } = useSelector(FFMSelector.getFFMLoaders);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<FFMMetrics | null>(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorStatusCode, setErrorStatusCode] = useState(null);

  useFocusEffect(
    useCallback(() => {
      // console.log("🚀 ~ file: index.tsx ~ line 33 ~ useCallback ~ theme", theme.colors.warning)
      getMetrics();
    }, [])
  );

  const getMetrics = (): void => {
    setLoading(true);
    FFMRepository.getManagementTab()
      .then((res) => {
        console.log('🚀 ~ file: index.tsx ~ line 36 ~ .then ~ res', res);
        setMetrics(res);
        setLoading(false);
        setErrorMessage(null);
      })
      .catch((e) => {
        var statusCode = ErrorUtils.getErrorCode(e.details);
        // console.log('🚀 ~ file: index.tsx ~ line 45 ~ getMetrics ~ e', statusCode);
        if (statusCode == 5001) {
          replace(ScreenKeys.AuthStack, { screen: ScreenKeys.OnBoarding, params: { isFromDashboard: 1 } });
          // return;
          setLoading(false);
        } else {
          // alert(statusCode)
          // console.log('🚀 ~ file: index.tsx ~ line 45 ~ getMetrics ~ e', ErrorUtils.getErrorCode(e.details));
          setErrorStatusCode(statusCode);
          setLoading(false);
          setErrorMessage(ErrorUtils.getErrorMessage(e.details));
        }
      });
  };

  const onViewAllProperties = (): void => {
    navigate(ScreenKeys.HotProperties);
  };

  const navigateToRequests = (): void => {
    navigate(ScreenKeys.Requests);
  };

  const renderAssetMetricsAndUpdates = (data: FFMMetrics): React.ReactElement => {
    const { jobs, notifications, tickets } = data.updates;
    return (
      <>
        <AssetMetricsList title={`${0}`} subTitleText={t('properties')} data={data.miscellaneous} />
        <AssetSummary
          isFFM
          jobs={jobs.count}
          serviceTickets={tickets.count}
          notification={notifications.count}
          containerStyle={styles.assetCards()}
          onPressServiceTickets={navigateToRequests}
        />
      </>
    );
  };
  return (
    <GradientScreen
      isUserHeader
      isScrollable
      loading={hotProperties || loading}
      screenTitle={t('assetDashboard:dashboard')}
      containerStyle={styles.container}
    >
      {metrics && renderAssetMetricsAndUpdates(metrics)}
      <View style={styles.flexOne}>
        <View style={styles.headerStyle}>
          <Text type="small" textType="semiBold">
            {t('property:hotProperties')}
          </Text>
          {!errorMessage && (
            <TouchableOpacity onPress={onViewAllProperties}>
              <Text type="small" style={styles.view}>
                {t('assetDashboard:viewAll')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {!errorMessage && <HotPropertiesTab isOnDashboard />}
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: '60%' }}>
        {errorMessage && (
          <Text
            style={[
              styles.errorTextStyle,
              {
                color:
                  errorStatusCode && errorStatusCode == 5003
                    ? theme.colors.warning
                    : errorStatusCode == 5004
                    ? theme.colors.error
                    : theme.colors.blackTint1,
              },
            ]}
          >
            {errorMessage}
          </Text>
        )}
      </View>
    </GradientScreen>
  );
};

export default Dashboard;
const styles = {
  container: {
    backgroundColor: theme.colors.background,
    padding: 0,
  },
  flexOne: {
    flex: 1,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    marginHorizontal: 10,
  },
  view: {
    color: theme.colors.primaryColor,
  },
  errorTextStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  assetCards: (): StyleProp<ViewStyle> => ({
    marginVertical: 12,
    flex: 0,
    borderWidth: 0.5,
    borderColor: theme.colors.disabled,
  }),
  evenItem: (): StyleProp<ViewStyle> => ({
    marginEnd: 17,
  }),
};
