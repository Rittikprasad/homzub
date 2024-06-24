import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TabView } from 'react-native-tab-view';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import ReloadCircle from '@homzhub/common/src/assets/images/reloadCircle.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { flags } from '@homzhub/common/src/components/atoms/Flag';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import { AddressWithStepIndicator } from '@homzhub/common/src/components/molecules/AddressWithStepIndicator';
import ValueAddedServicesOverview from '@homzhub/web/src/components/molecules/ValueAddedServicesOverview';
import { PropertyPayment } from '@homzhub/common/src/components/organisms/PropertyPayment';
import { ValueAddedServicesView } from '@homzhub/common/src/components/organisms/ValueAddedServicesView';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { IGetServicesByIds, ISelectedValueServices } from '@homzhub/common/src/domain/models/ValueAddedService';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IBadgeInfo } from '@homzhub/mobile/src/navigation/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IRoutes {
  key: string;
  title: string;
}

enum RouteKeys {
  Services = 'Services',
  Payment = 'Payment',
  SERVICE_PAYMENT = 'Services & Payment',
}

const { height, width } = theme.viewport;
const TAB_LAYOUT = {
  width: width - theme.layout.screenPadding * 2,
  height,
};

interface ISelectServiceParams {
  propertyId: number;
  assetType: string;
  projectName: string;
  address: string;
  serviceByIds: IGetServicesByIds;
  badgeInfo: IBadgeInfo;
  amenities: IAmenitiesIcons[];
  attachments: Attachment[];
  assetCount: number;
  iso2Code: string;
}

const SelectServices = (): ReactElement => {
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const { goBackClicked, setGoBackClicked } = useContext(AppLayoutContext);

  const {
    state: {
      propertyId,
      projectName,
      assetType,
      address,
      serviceByIds,
      badgeInfo,
      amenities,
      attachments,
      assetCount,
      iso2Code,
    },
  } = useLocation<ISelectServiceParams>();

  const { t, i18n, ready: tReady } = useTranslation();

  // Constants
  const desktopRoute = [{ key: RouteKeys.SERVICE_PAYMENT, title: t('assetMore:premiumServices') }];
  const mobileTabpRoutes = [
    { key: RouteKeys.Services, title: t('assetMore:premiumServices') },
    { key: RouteKeys.Payment, title: t('assetMore:premiumServices') },
  ];
  const Routes: IRoutes[] = isDesktop ? desktopRoute : mobileTabpRoutes;
  const Steps = isDesktop ? [RouteKeys.SERVICE_PAYMENT] : [RouteKeys.Services, RouteKeys.Payment];
  const primaryAddressTextStyles = { size: 'small' };
  const subAddressTextStyles = { variant: 'label', size: 'large' };

  // Local State
  const popupRef = useRef<PopupActions>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStepDone, setStepPositionArr] = useState<boolean[]>([false, false]);
  const [tabViewHeights, setIsStepDone] = useState<number[]>([height, height]);
  // Redux
  const dispatch = useDispatch();
  const history = useHistory();
  const valueAddedServices = useSelector(RecordAssetSelectors.getValueAddedServices);

  useEffect(() => {
    dispatch(RecordAssetActions.getValueAddedServices({ ...serviceByIds }));
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (goBackClicked) {
      onBackPress(true);
      setGoBackClicked(false);
    }
  }, [goBackClicked]);

  const navigateToValueAddedServices = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
    NavigationService.navigate(history, { path: RouteNames.protectedRoutes.SELECT_PROPERTY });
  };
  const render = (): ReactElement => {
    return (
      <View style={styles.container}>
        {isDesktop && (
          <ValueAddedServicesOverview
            propertiesCount={assetCount}
            propertySelected={1}
            servicesAvailable={valueAddedServices.length}
          />
        )}
        <View style={styles.wrapper}>
          <View style={styles.tabViewContainer}>
            <AddressWithStepIndicator
              steps={Steps}
              propertyType={assetType}
              primaryAddress={projectName}
              subAddress={address}
              // @ts-ignore
              countryFlag={flags[iso2Code]}
              currentIndex={currentIndex}
              isStepDone={isStepDone}
              onPressSteps={onStepPress}
              badgeInfo={badgeInfo}
              badgeStyle={styles.badgeStyle}
              amenities={amenities}
              stepIndicatorSeparatorStyle={{ width: width / 2 }}
              attachments={attachments}
              displayIndicator={!isDesktop}
              primaryAddressTextStyles={primaryAddressTextStyles as ITypographyProps}
              subAddressTextStyles={subAddressTextStyles as ITypographyProps}
              topNode={renderRightHandHeader()}
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
          </View>
          {isDesktop && (
            <PropertyPayment
              goBackToService={goBackToServices}
              propertyId={propertyId}
              valueAddedServices={valueAddedServices}
              setValueAddedServices={setValueAddedServices}
              handleNextStep={onSuccessFullPayment}
            />
          )}
          <Popover
            forwardedRef={popupRef}
            popupProps={{
              modal: true,
              position: 'center center',
              arrow: false,
              closeOnDocumentClick: false,
              onClose: onSheetClose,
              children: undefined,
              contentStyle: { width: '50%', borderRadius: 4 },
            }}
            content={<BackWarningPopover />}
          />
        </View>
      </View>
    );
  };

  const BackWarningPopover = (): React.ReactElement => (
    <View style={styles.popoverContent}>
      <View style={[styles.popoverHeader, styles.popoverSpacing]}>
        <Text type="small" textType="semiBold" style={styles.heading}>
          {t('common:changePropertyText')}
        </Text>
        <Button type="text" icon={icons.close} iconSize={24} onPress={onSheetClose} />
      </View>
      <View style={[styles.popoverSpacing, styles.popoverBody]}>
        <Text type="small" style={styles.message}>
          {t('assetMore:changePropertyCaution')}
        </Text>
      </View>
      <View style={[styles.buttonContainer, styles.popoverSpacing]}>
        <Button
          type="secondary"
          title={t('common:continue')}
          titleStyle={styles.buttonTitle}
          onPress={navigateToValueAddedServices}
          containerStyle={styles.editButton}
        />
        <Button
          type="primary"
          title={t('common:cancel')}
          onPress={onSheetClose}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.doneButton}
        />
      </View>
    </View>
  );

  const renderScene = ({ route }: { route: IRoutes }): any => {
    switch (route.key) {
      case RouteKeys.SERVICE_PAYMENT:
        return (
          <ValueAddedServicesView
            isDesktop={isDesktop}
            propertyId={propertyId}
            valueAddedServices={valueAddedServices}
            searchStyle={styles.searchStyle}
            setValueAddedServices={setValueAddedServices}
            handleNextStep={handleNextStep}
            buttonStyle={styles.buttonStyle}
          />
        );
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
              i18n={i18n}
              tReady={tReady}
              t={t}
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
    return (
      <View style={styles.tabHeader}>
        <Text type="small" textType="semiBold" style={styles.title}>
          {tabTitle}
        </Text>
      </View>
    );
  };

  const renderRightHandHeader = (): ReactElement => {
    const onChangePress = (): void => {
      onBackPress(false);
    };
    return (
      <View style={styles.selectedPropertyRow}>
        <Text type="small" textType="semiBold">
          {t('assetMore:selectedProperty')}
        </Text>
        <TouchableOpacity style={styles.changeBtn} onPress={onChangePress}>
          <ReloadCircle />
          <Text type="small" textType="semiBold" style={styles.changeText}>
            {t('common:change')}
          </Text>
        </TouchableOpacity>
      </View>
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
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  const onBackPress = (isBackPressed: boolean): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  const onSuccessFullPayment = (): void => {
    navigateToValueAddedServices();
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

export default SelectServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 24,
  },
  tabViewContainer: {
    flex: 3,
  },
  searchStyle: {
    width: '40%',
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    left: 16,
  },
  title: {
    paddingVertical: 16,
  },
  selectedPropertyRow: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    color: theme.colors.primaryColor,
    marginLeft: 4,
  },
  message: {
    color: theme.colors.darkTint2,
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    marginLeft: 10,
    flexDirection: 'row-reverse',
  },
  doneButton: {
    flexDirection: 'row-reverse',
    marginLeft: 16,
  },
  buttonTitle: {
    marginHorizontal: 24,
    marginVertical: 10,
  },
  popoverContent: {
    paddingVertical: 16,
  },
  popoverSpacing: {
    paddingHorizontal: 24,
  },
  heading: {
    color: theme.colors.darkTint2,
  },
  popoverBody: {
    borderColor: theme.colors.divider,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 16,
    marginVertical: 16,
  },
  popoverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
