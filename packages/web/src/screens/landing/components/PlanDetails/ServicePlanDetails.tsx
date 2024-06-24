import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useDown, useViewPort, useIsIpadPro } from '@homzhub/common/src/utils/MediaQueryUtils';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { RecordAssetSelectors } from '@homzhub/common/src/modules/recordAsset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import { IState } from '@homzhub/common/src/modules/interfaces';

export interface ILocationState {
  planId: string;
}

const ServicePlanDetails: React.FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const { t } = useTranslation();
  const isIpadPro = useIsIpadPro();
  const scaleY = isTablet || isIpadPro ? (isMobile ? 0.37 : 0.6) : 0.5;
  const imageStyle = {
    minWidth: useViewPort().width - 15,
    minHeight: useViewPort().height * scaleY,
  };
  const history = useHistory<ILocationState>();
  const { location } = history;
  const {
    state: { planId },
  } = location;
  // Redux
  const dispatch = useDispatch();
  const servicePlan = useSelector((state: IState) => RecordAssetSelectors.getValueAddedService(state, planId));
  useEffect(() => {
    const serviceByIds = {
      assetGroupId: 1,
      countryId: 1,
      city: 'Pune',
    };
    dispatch(RecordAssetActions.getValueAddedServices({ ...serviceByIds }));
  }, []);
  const { bundlePrice, priceLabel, valueBundle, currency } = servicePlan;
  const { label, description, terms, benefits, valueBundleItems } = valueBundle;
  const { currencyCode } = currency;
  const transformServices = (items: ServiceBundleItems[]): any => {
    const servicesById: number[] = [];
    const servicesFiltered = [];
    if (items.length) {
      for (let i = 0; i < items.length; i++) {
        const service = items[i];
        if (!servicesById.includes(service.serviceItemCategory.id)) {
          servicesById.push(service.serviceItemCategory.id);
        }
      }
      for (let i = 0; i < servicesById.length; i++) {
        const serviceId = servicesById[i];
        const servicesGrouped = [];
        for (let j = 0; j < items.length; j++) {
          const service = items[j];
          const { serviceItemCategory } = service;
          if (serviceId === serviceItemCategory.id) {
            servicesGrouped.push(service);
          }
        }
        servicesFiltered.push(servicesGrouped);
      }
      return servicesFiltered;
    }
    return [];
  };

  const services = transformServices(valueBundleItems);
  return (
    <View style={styles.container}>
      <ImageSquare
        style={[styles.image, imageStyle]}
        size={30}
        source={{
          uri: require('@homzhub/common/src/assets/images/ServicePlanBG.jpg'),
        }}
      />
      <View style={styles.subContainer}>
        <Typography variant="title" size="large" fontWeight="semiBold" style={styles.pageTitle}>
          {label}
        </Typography>
        <Button type="primary" title={t('landing:enquireNow')} containerStyle={styles.buttonEnquireNow} />
        <Divider containerStyles={styles.divider} />
        <Typography variant="text" size="regular" fontWeight="regular" style={styles.description}>
          {description}
        </Typography>
        <View style={styles.priceLabel}>
          <Typography variant="text" size="regular" fontWeight="bold">
            {t('property:youPay')}:&nbsp;
          </Typography>
          <Typography variant="text" size="regular" fontWeight="regular">
            {currencyCode} {priceLabel}
          </Typography>
        </View>
        <View style={styles.tokenAmountContainer}>
          <Typography variant="text" size="regular" fontWeight="bold" style={styles.tokenAmount}>
            {t('property:tokenAmount')}
          </Typography>
          <Typography variant="text" size="regular" fontWeight="bold" style={styles.tokenAmount}>
            {currencyCode} {bundlePrice}
          </Typography>
        </View>
        <Button type="primary" title={t('landing:enquireNow')} containerStyle={styles.buttonEnquireNow} />
        <View>
          <Typography variant="text" size="regular" fontWeight="bold" style={styles.servicesHeader}>
            {t('property:services')}
          </Typography>
          {services.length &&
            services.map((serviceGroup: any, index: number) => (
              <View key={index} style={styles.serviceContainer}>
                <Typography variant="text" size="regular" fontWeight="bold">
                  {serviceGroup[0].serviceItemCategory.label}
                </Typography>
                <ul>
                  {serviceGroup.map((service: ServiceBundleItems) => (
                    <li key={service.id}>
                      <Typography variant="text" size="regular" fontWeight="regular" style={styles.serviceFeature}>
                        {service.label}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </View>
            ))}
        </View>
        {benefits.length ? (
          <View style={styles.serviceContainer}>
            <Typography variant="text" size="regular" fontWeight="bold">
              {t('landing:benefits')}:
            </Typography>
            <ul>
              {benefits.map((benefit) => (
                <li key={benefit.id}>
                  <Typography variant="text" size="regular" fontWeight="regular" style={styles.serviceFeature}>
                    {benefit.title}
                  </Typography>
                </li>
              ))}
            </ul>
          </View>
        ) : (
          <View />
        )}
        {terms.length ? (
          <View style={styles.serviceContainer}>
            <Typography variant="text" size="regular" fontWeight="bold">
              {t('moreSettings:termsConditionsText')}:
            </Typography>
            <ul>
              {terms.map((term) => (
                <li key={term.id}>
                  <Typography variant="text" size="regular" fontWeight="regular" style={styles.serviceFeature}>
                    {term.title}
                  </Typography>
                </li>
              ))}
            </ul>
          </View>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

export default ServicePlanDetails;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  subContainer: {
    marginLeft: '7%',
  },
  pageTitle: {
    marginVertical: 40,
  },
  buttonEnquireNow: {
    width: 250,
    marginBottom: 30,
  },
  divider: {
    width: 250,
    color: theme.colors.darkTint10,
    marginBottom: 30,
  },
  description: {
    marginBottom: 10,
  },
  priceLabel: {
    flexDirection: 'row',
  },
  tokenAmountContainer: {
    flexDirection: 'row',
  },
  tokenAmount: {
    color: theme.colors.blue,
    marginVertical: 40,
  },
  serviceContainer: {
    marginBottom: 20,
  },
  servicesHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  serviceFeature: {
    marginBottom: 2,
  },
});
