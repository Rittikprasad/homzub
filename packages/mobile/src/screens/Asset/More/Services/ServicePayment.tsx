import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { PropertyPayment } from '@homzhub/common/src/components/organisms/PropertyPayment';
import { ISelectedValueServices } from '@homzhub/common/src/domain/models/ValueAddedService';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IVASBought } from '@homzhub/common/src/services/Analytics/interfaces';

const ServicePayment = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { params } = useRoute();
  const { goBack, navigate } = useNavigation();
  const valueAddedServices = useSelector(RecordAssetSelectors.getValueAddedServices);

  const setValueAddedServices = (payload: ISelectedValueServices): void => {
    dispatch(RecordAssetActions.setValueAddedServices(payload));
  };

  const goBackToService = (): void => {
    navigate(ScreensKeys.ServiceSelection);
  };

  const onSuccessFullPayment = (): void => {
    const trackData: IVASBought = {
      // @ts-ignore
      address: params?.address,
    };
    AnalyticsService.track(EventType.ValueAddedType, trackData);
    navigate(ScreensKeys.ServicesDashboard);
  };

  return (
    <UserScreen
      title={t('marketPlace')}
      onBackPress={goBack}
      pageTitle={t('property:orderSummary')}
      isGradient
      isBackgroundRequired
      backgroundColor={theme.colors.white}
    >
      <PropertyPayment
        goBackToService={goBackToService}
        // @ts-ignore
        propertyId={params?.propertyId}
        valueAddedServices={valueAddedServices}
        setValueAddedServices={setValueAddedServices}
        handleNextStep={onSuccessFullPayment}
        containerStyle={styles.containerStyle}
      />
    </UserScreen>
  );
};

export default ServicePayment;

const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: 0,
  },
});
