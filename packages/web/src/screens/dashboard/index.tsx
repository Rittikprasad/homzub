import React, { FC, useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IRedirectionDetailsWeb, NavigationService } from '@homzhub/web/src/services/NavigationService';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { RouteNames, ScreensKeys } from '@homzhub/web/src/router/RouteNames';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { AddPropertyStack } from '@homzhub/web/src/screens/addProperty';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import PropertyUpdates from '@homzhub/web/src/screens/dashboard/components/PropertyUpdates';
import PropertyOverview from '@homzhub/web/src/screens/dashboard/components/PropertyOverview';
import { PropertyVisualsEstimates } from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import VacantProperties from '@homzhub/web/src/screens/dashboard/components/VacantProperties';
import { PendingPropertiesCard } from '@homzhub/web/src/components';
import { Asset, PropertyStatus } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { IActions } from '@homzhub/common/src/domain/models/AssetPlan';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const Dashboard: FC = () => {
  const history = useHistory();
  const notMobile = useUp(deviceBreakpoint.TABLET);
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const selectedCountry: number = useSelector(UserSelector.getUserCountryCode);
  const [pendingProperty, setPendingProperty] = useState({} as Asset[]);
  const [vacantProperty, setVacantProperty] = useState({} as Asset[]);
  const [propertyMetrics, setPropertyMetrics] = useState({} as AssetMetrics);
  const [isPendingProperties, setIsPendingProperties] = useState(false);
  const [isVacantProperties, setIsVacantProperties] = useState(false);
  const [isPropertyMeterics, setIsPropertyMeterics] = useState(false);

  const onCompleteDetails = (assetId: number): void => {
    dispatch(RecordAssetActions.setAssetId(assetId));
    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.PROPERTY_VIEW,
      params: {
        previousScreen: ScreensKeys.Dashboard,
        currentScreen: AddPropertyStack.AddPropertyViewScreen,
      },
    });
  };

  const handleActionSelection = (item: IActions, assetId: number): void => {
    dispatch(RecordAssetActions.setAssetId(assetId));
    dispatch(RecordAssetActions.setSelectedPlan({ id: item.id, selectedPlan: item.type }));
    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.ADD_LISTING,
      params: {
        previousScreen: ScreensKeys.Dashboard,
      },
    });
  };

  const onViewProperty = (id: number): void => {
    NavigationService.navigate(history, {
      path: RouteNames.protectedRoutes.PROPERTY_SELECTED,
      params: { propertyId: id },
    });
  };
  const getPendingPropertyDetails = async (callback: (response: Asset[]) => void): Promise<void> => {
    try {
      setIsPendingProperties(true);
      const response: Asset[] = await AssetRepository.getPropertiesByStatus(PropertyStatus.PENDING);
      setIsPendingProperties(false);
      callback(response);
    }catch (e: any) {      setIsPendingProperties(false);
    }
  };

  const getPropertyMetrics = async (callback: (response: AssetMetrics) => void): Promise<void> => {
    try {
      setIsPropertyMeterics(true);
      const response: AssetMetrics = await DashboardRepository.getAssetMetrics();
      setIsPropertyMeterics(false);
      callback(response);
    }catch (e: any) {      setIsPropertyMeterics(false);
    }
  };
  const getVacantPropertyDetails = async (callback: (response: Asset[]) => void): Promise<void> => {
    try {
      setIsVacantProperties(true);
      const response: Asset[] = await PortfolioRepository.getUserAssetDetails(Filters.VACANT);
      setIsVacantProperties(false);
      callback(response);
    }catch (e: any) {      setIsVacantProperties(false);
    }
  };

  const redirectionDetails = useSelector(CommonSelectors.getRedirectionDetails);
  const { dynamicLinks: dynamicLinkParams } = redirectionDetails as IRedirectionDetailsWeb;

  useEffect(() => {
    if (dynamicLinkParams?.type?.length) {
      NavigationService.handleDynamicLinkNavigation(dynamicLinkParams);
    } else {
      if (isLoggedIn) {
        dispatch(UserActions.getUserPreferences());
        dispatch(UserActions.getUserProfile());
        dispatch(UserActions.getFavouriteProperties());
        dispatch(UserActions.getAssets());
        dispatch(CommonActions.getCountries());
      }
      getPendingPropertyDetails(setPendingProperty).then();
      getPropertyMetrics((response) => setPropertyMetrics(response)).then();
      getVacantPropertyDetails((response) => setVacantProperty(response)).then();
    }
  }, [dispatch, isLoggedIn]);
  const commonLoaders = useSelector(CommonSelectors.getCommonLoaders);
  const { whileGetCountries } = commonLoaders;
  const userLoaders = useSelector(UserSelector.getUserLoaders);
  const { userProfile, userPreferences, whileAssets, whileFavouriteProperties } = userLoaders;
  const { setIsMenuLoading } = useContext(AppLayoutContext);

  const isLoading =
    isPendingProperties ||
    isVacantProperties ||
    isPropertyMeterics ||
    whileGetCountries ||
    userProfile ||
    userPreferences ||
    whileAssets ||
    whileFavouriteProperties;

  setIsMenuLoading(isLoading);

  const bannerImage = {
    height: 354,
    width: 496,
  };
  const PendingPropertyAndUserSubscriptionComponent = (): React.ReactElement => (
    <>
      <PendingPropertiesCard
        data={pendingProperty}
        onPressComplete={onCompleteDetails}
        onSelectAction={handleActionSelection}
        onViewProperty={onViewProperty}
      />
      {isDesktop && (
        <View style={styles.bannerStyle}>
          <Image source={require('@homzhub/common/src/assets/images/InfoBanner.svg')} style={bannerImage} />
        </View>
      )}
    </>
  );
  if (isLoading) {
    return <Loader visible={isLoading} />;
  }
  return (
    <View style={styles.container}>
      <PropertyOverview
        data={propertyMetrics?.assetMetrics?.miscellaneous ?? []}
        propertyCount={propertyMetrics?.assetMetrics?.assets?.count}
      />
      <PropertyUpdates updatesData={propertyMetrics?.updates ?? {}} />
      <PropertyVisualsEstimates selectedCountry={selectedCountry} />
      {notMobile ? (
        <View style={[styles.wrapper, notMobile && styles.row]}>
          <PendingPropertyAndUserSubscriptionComponent />
        </View>
      ) : (
        <PendingPropertyAndUserSubscriptionComponent />
      )}
      <VacantProperties data={vacantProperty} />
      <MarketTrendsCarousel />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  bannerStyle: {
    width: '40vw',
    height: '100%',
    paddingTop: '2%',
  },
});
