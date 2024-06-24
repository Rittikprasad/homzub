import React, { ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TabView } from 'react-native-tab-view';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/MoreStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import { PropertyPayment } from '@homzhub/common/src/components/organisms/PropertyPayment';
import { AddressWithStepIndicator } from '@homzhub/common/src/components/molecules/AddressWithStepIndicator';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import { ValueAddedServicesView } from '@homzhub/common/src/components/organisms/ValueAddedServicesView';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { ISelectedValueServices } from '@homzhub/common/src/domain/models/ValueAddedService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IVASBought } from '@homzhub/common/src/services/Analytics/interfaces';

type IProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.ServicesForSelectedAsset>;

interface IRoutes {
  key: string;
  title: string;
}

enum RouteKeys {
  Services = 'Services',
  Payment = 'Payment',
}

const { height, width } = theme.viewport;
const TAB_LAYOUT = {
  width: width - theme.layout.screenPadding * 2,
  height,
};

export const ServicesForSelectedAsset = (props: IProps): ReactElement => {
  const {
    navigation,
    route: {
      params: { propertyId, projectName, assetType, address, flag, serviceByIds, badgeInfo, amenities },
    },
  } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetMore);

  // Constants
  const Routes: IRoutes[] = [
    { key: RouteKeys.Services, title: t('premiumPaidServices') },
    { key: RouteKeys.Payment, title: t('property:payment') },
  ];
  const Steps = [RouteKeys.Services, RouteKeys.Payment];
  const primaryAddressTextStyles = { size: 'small' };
  const subAddressTextStyles = { variant: 'label', size: 'large' };

  // Local State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [showGoBackCaution, setShowGoBackCaution] = useState(false);
  const [isStepDone, setStepPositionArr] = useState<boolean[]>([false, false]);
  const [tabViewHeights, setIsStepDone] = useState<number[]>([height, height]);

  useEffect(() => {
    setStepPositionArr([currentIndex === 1, false]);
  }, [currentIndex]);

  // Redux
  const dispatch = useDispatch();
  const valueAddedServices = useSelector(RecordAssetSelectors.getValueAddedServices);

  useEffect(() => {
    dispatch(RecordAssetActions.getValueAddedServices(serviceByIds));
    setLoading(false);
  }, []);

  const render = (): ReactElement => {
    const goBack = (): void => {
      onBackPress(true);
    };

    return (
      <UserScreen
        loading={loading}
        title={t('common:marketPlace')}
        pageTitle={t('premiumServices')}
        onBackPress={goBack}
        rightNode={renderRightHandHeader()}
      >
        <View>
          <AddressWithStepIndicator
            steps={Steps}
            propertyType={assetType}
            primaryAddress={projectName}
            subAddress={address}
            countryFlag={flag}
            currentIndex={currentIndex}
            isStepDone={isStepDone}
            onPressSteps={onStepPress}
            badgeInfo={badgeInfo}
            badgeStyle={styles.badgeStyle}
            amenities={amenities}
            stepIndicatorSeparatorStyle={{ width: width / 2 }}
            primaryAddressTextStyles={primaryAddressTextStyles as ITypographyProps}
            subAddressTextStyles={subAddressTextStyles as ITypographyProps}
          />
          {renderTabHeader()}
          <TabView
            initialLayout={TAB_LAYOUT}
            renderScene={renderScene}
            onIndexChange={handleIndexChange}
            renderTabBar={(): null => null}
            swipeEnabled={false}
            navigationState={{
              index: currentIndex,
              routes: Routes,
            }}
            style={{ height: tabViewHeights[currentIndex] }}
          />
          <BottomSheet
            visible={bottomSheetVisible}
            headerTitle={showGoBackCaution ? t('common:backText') : t('common:changePropertyText')}
            sheetHeight={350}
            onCloseSheet={onSheetClose}
          >
            <View style={styles.bottomSheet}>
              <Text type="small">{showGoBackCaution ? t('goBackCaution') : t('changePropertyCaution')}</Text>
              <Text type="small" style={styles.message}>
                {t('common:wantToContinue')}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  type="secondary"
                  title={showGoBackCaution ? t('common:yes') : t('common:continue')}
                  titleStyle={styles.buttonTitle}
                  onPress={navigation.goBack}
                  containerStyle={styles.editButton}
                />
                <Button
                  type="primary"
                  title={showGoBackCaution ? t('common:no') : t('common:cancel')}
                  onPress={onSheetClose}
                  titleStyle={styles.buttonTitle}
                  containerStyle={styles.doneButton}
                />
              </View>
            </View>
          </BottomSheet>
        </View>
      </UserScreen>
    );
  };

  const renderScene = ({ route }: { route: IRoutes }): any => {
    switch (route.key) {
      case RouteKeys.Services:
        return (
          <View onLayout={(e): void => onLayout(e, 0)}>
            <ValueAddedServicesView
              propertyId={propertyId}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              handleNextStep={handleNextStep}
              buttonStyle={styles.buttonStyle}
            />
          </View>
        );
      case RouteKeys.Payment:
        return (
          <View onLayout={(e): void => onLayout(e, 1)}>
            <PropertyPayment
              goBackToService={goBackToServices}
              propertyId={propertyId}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              handleNextStep={onSuccessFullPayment}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const renderTabHeader = (): ReactElement => {
    const tabTitle = Routes[currentIndex].title;
    const hasServices = valueAddedServices.length > 0;
    return (
      <View style={styles.tabHeader}>
        <Text type="small" textType="semiBold" style={hasServices ? styles.title : styles.headerWithoutSubHeader}>
          {tabTitle}
        </Text>
        {hasServices && (
          <Label type="regular" textType="regular" style={styles.subHeader}>
            {t('property:chooseServiceText')}
          </Label>
        )}
      </View>
    );
  };

  const renderRightHandHeader = (): ReactElement => {
    const onChangePress = (): void => {
      onBackPress(false);
    };
    return (
      <TouchableOpacity onPress={onChangePress}>
        <Text type="small" textType="semiBold" style={styles.changeText}>
          {t('common:change')}
        </Text>
      </TouchableOpacity>
    );
  };

  const onStepPress = (index: number): void => {
    const value = index - currentIndex;
    if (index < currentIndex) {
      setCurrentIndex(currentIndex + value);
    }
  };

  const handleIndexChange = (index: number): void => {
    setCurrentIndex(index);
    setStepPositionArr([true, false]);
  };

  const goBackToServices = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleNextStep = (): void => {
    if (currentIndex < Routes.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const onSheetClose = (): void => {
    setBottomSheetVisible(false);
  };

  const onBackPress = (isBackPressed: boolean): void => {
    if (valueAddedServices.filter((service) => service.value).length === 0) {
      navigation.goBack();
      return;
    }
    setShowGoBackCaution(isBackPressed);
    setBottomSheetVisible(true);
  };

  const onSuccessFullPayment = (): void => {
    const trackData: IVASBought = {
      address,
    };
    AnalyticsService.track(EventType.ValueAddedType, trackData);
    // @ts-ignore
    navigation.navigate(ScreensKeys.ServicesDashboard);
  };

  const setValueAddedServices = (payload: ISelectedValueServices): void => {
    dispatch(RecordAssetActions.setValueAddedServices(payload));
  };

  const onLayout = (e: LayoutChangeEvent, index: number): void => {
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...tabViewHeights];

    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight;
      setIsStepDone(arrayToUpdate);
    }
  };

  return render();
};

const styles = StyleSheet.create({
  tabHeader: {
    backgroundColor: theme.colors.background,
  },
  title: {
    paddingTop: 16,
  },
  changeText: {
    color: theme.colors.primaryColor,
  },
  message: {
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
    height: 50,
  },
  doneButton: {
    flexDirection: 'row-reverse',
    height: 50,
  },
  buttonTitle: {
    marginHorizontal: 4,
  },
  bottomSheet: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  badgeStyle: {
    minWidth: 75,
    paddingHorizontal: 10,
    paddingVertical: 1,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  buttonStyle: {
    marginHorizontal: theme.layout.screenPadding,
  },
  subHeader: {
    marginTop: 5,
    marginBottom: 10,
  },
  headerWithoutSubHeader: {
    paddingVertical: 16,
  },
});
