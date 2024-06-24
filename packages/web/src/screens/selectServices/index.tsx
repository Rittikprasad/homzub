import React, { useEffect, useState, useRef } from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { ServiceActions } from '@homzhub/common/src/modules/service/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { ServiceSelector } from '@homzhub/common/src/modules/service/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ServiceView from '@homzhub/common/src/components/molecules/ServiceView';
import ValueAddedServicesOverview from '@homzhub/web/src/components/molecules/ValueAddedServicesOverview';
import OrderSummaryPopover from '@homzhub/web/src/components/organisms/OrderSummaryPopover';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const ServiceSelection = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { navigate } = NavigationService;
  const cities = useSelector(ServiceSelector.getServiceCities);
  const valueAddedServices = useSelector(RecordAssetSelectors.getValueAddedServices);
  const assets = useSelector(ServiceSelector.getServiceAssets);
  const [selectedCity, setCity] = useState('');

  useEffect(() => {
    dispatch(ServiceActions.getServiceCities());
    dispatch(ServiceActions.getServiceAssets());
    dispatch(RecordAssetActions.getValueAddedServices({ withoutParam: true }));
  }, []);

  const getCityOptions = (): PickerItemProps[] => {
    return cities.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
  };

  const getServices = (): ValueAddedService[] => {
    const cityAsset = assets.filter((item) => item.city === selectedCity);
    const filteredServices = valueAddedServices.filter((item) => item.assetCity?.name === selectedCity);

    // If asset is availble in selected city show all services for that city
    if (cityAsset.length > 0) {
      return filteredServices;
    }

    // If there is no asset in selected city show only asset independent services
    return filteredServices.filter((item) => !item.valueBundle.isAssetDependent);
  };

  const setValueAddedServices = (payload: ISelectedValueServices): void => {
    dispatch(RecordAssetActions.setValueAddedServices(payload));
  };

  const history = useHistory();

  const popupRef = useRef<PopupActions>(null);

  const onOpenModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };
  const onCloseModal = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
    }
  };

  const onContinue = (): void => {
    const cityAsset = assets.filter((item) => item.city === selectedCity);
    const assetService = valueAddedServices.filter((item) => item.valueBundle.isAssetDependent && item.value);
    if (cityAsset.length > 0 && assetService.length > 0) {
      navigate(history, { path: RouteNames.protectedRoutes.SELECT_PROPERTY, params: { city: selectedCity } });
    } else {
      onOpenModal(); // Open Pay Modal
    }
  };

  const onSelectCity = (value: string): void => {
    setCity(value);
  };

  const isDisabled = !valueAddedServices.filter((item) => item.value).length;
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  return (
    <View style={styles.container}>
      {isDesktop && (
        <ValueAddedServicesOverview
          propertiesCount={assets.length}
          propertySelected={1}
          servicesAvailable={valueAddedServices.length}
        />
      )}
      <View style={styles.contentContainer}>
        <View style={styles.servicesContainer}>
          <View style={styles.dropdownContainer}>
            <Typography size="small" variant="text" fontWeight="semiBold">
              {t('property:serviceSelection')}
            </Typography>
            <Dropdown
              data={getCityOptions()}
              value={selectedCity}
              onDonePress={(value: string): void => onSelectCity(value)}
              placeholder={t('selectYourCity')}
              listTitle={t('selectYourCity')}
              containerStyle={styles.dropdown}
            />
          </View>
          <Text type="small" style={styles.title}>
            {t('property:addOnService')}
          </Text>
          {selectedCity ? (
            <ServiceView services={getServices()} setValueAddedServices={setValueAddedServices} />
          ) : (
            <EmptyState title={t('property:selectCityForService')} />
          )}
          <OrderSummaryPopover popupRef={popupRef} onOpenModal={onOpenModal} onCloseModal={onCloseModal} />
        </View>
        <View style={styles.selectionListContainer}>
          <Button
            type="primary"
            title={t('continue')}
            containerStyle={styles.button}
            disabled={isDisabled}
            onPress={onContinue}
          />
        </View>
      </View>
    </View>
  );
};

export default ServiceSelection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  servicesContainer: {
    width: '70%',
    padding: 16,
    backgroundColor: theme.colors.white,
    marginTop: 24,
    marginRight: 24,
  },
  selectionListContainer: {
    width: '30%',
    backgroundColor: theme.colors.white,
    marginTop: 24,
    marginRight: 24,
    height: 'fit-content',
    flexDirection: 'column',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown: {
    paddingVertical: 10,
    minWidth: 200,
  },
  title: {
    marginVertical: 20,
  },
  button: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
});
