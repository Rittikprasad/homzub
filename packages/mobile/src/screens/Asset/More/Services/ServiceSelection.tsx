import React, { useEffect, useState } from 'react';
import { PickerItemProps, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { ServiceActions } from '@homzhub/common/src/modules/service/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { ServiceSelector } from '@homzhub/common/src/modules/service/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { WithShadowView } from '@homzhub/common/src/components/atoms/WithShadowView';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import ServiceView from '@homzhub/common/src/components/molecules/ServiceView';
import { ISelectedValueServices, ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const ServiceSelection = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigation();
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
    // return filteredServices;
  };

  const setValueAddedServices = (payload: ISelectedValueServices): void => {
    dispatch(RecordAssetActions.setValueAddedServices(payload));
  };

  const onSelectCity = (value: string | number): void => {
    setCity(value as string);
  };

  const onContinue = (): void => {
    const cityAsset = assets.filter((item) => item.city === selectedCity);
    const assetService = valueAddedServices.filter((item) => item.valueBundle.isAssetDependent && item.value);
    if (cityAsset.length > 0 && assetService.length > 0) {
      navigate(ScreensKeys.ValueAddedServices, { city: selectedCity });
    } else {
      navigate(ScreensKeys.ServicePayment);
    }
  };

  const isDisabled = !valueAddedServices.filter((item) => item.value).length;

  return (
    <>
      <UserScreen
        title={t('marketPlace')}
        pageTitle={t('property:serviceSelection')}
        contentContainerStyle={styles.contentContainer}
        isGradient
        isBackgroundRequired
        backgroundColor={theme.colors.white}
        onBackPress={goBack}
      >
        <Dropdown
          data={getCityOptions()}
          value={selectedCity}
          onDonePress={onSelectCity}
          placeholder={t('selectYourCity')}
          listTitle={t('selectYourCity')}
          containerStyle={styles.dropdown}
        />
        <Text type="small" style={styles.title}>
          {t('property:addOnService')}
        </Text>
        {selectedCity ? (
          <ServiceView services={getServices()} setValueAddedServices={setValueAddedServices} />
        ) : (
          <EmptyState title={t('property:selectCityForService')} />
        )}
      </UserScreen>
      <WithShadowView outerViewStyle={styles.shadowView}>
        <Button
          type="primary"
          title={t('continue')}
          containerStyle={styles.button}
          disabled={isDisabled}
          onPress={onContinue}
        />
      </WithShadowView>
    </>
  );
};

export default ServiceSelection;

const styles = StyleSheet.create({
  contentContainer: {
    margin: 16,
  },
  dropdown: {
    paddingVertical: 10,
  },
  title: {
    marginVertical: 20,
  },
  shadowView: {
    padding: 26,
    backgroundColor: theme.colors.white,
    marginBottom: 10,
  },
  button: {
    flex: 0,
  },
});
