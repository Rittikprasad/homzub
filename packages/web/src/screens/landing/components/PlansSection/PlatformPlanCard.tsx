import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import OrderedList from '@homzhub/web/src/screens/landing/components/OrderedList';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IDisclaimer {
  [key: string]: string;
}

const disclaimerSectionText: IDisclaimer = {
  FREEDOM: 'landing:freedom',
  PREMIUM: 'landing:premium',
  PRO: 'landing:pro',
  ENTERPRISE: 'landing:enterprise',
};

interface IProps {
  platformPlans: PlatformPlans;
}

// FixMe: (bishal -> mohak) sortData() usage needs to be changed.
const PlatformPlanCard: FC<IProps> = (props: IProps) => {
  const {
    platformPlans: { name, label, description, servicePlanBundle, servicePlanPricing },
  } = props;
  const { t } = useTranslation();

  const serviceBundles = servicePlanBundle;

  const sortData = (): void => {
    serviceBundles.sort((a: ServiceBundleItems, b: ServiceBundleItems) => (a.displayOrder > b.displayOrder ? 1 : -1));
  };

  const findIndex = (): number => {
    let indexForUSD = 0;
    for (let index = 0; index < servicePlanPricing.length; index++) {
      if (servicePlanPricing[index].currency.currencyCode === 'USD') {
        indexForUSD = index;
      }
    }
    return indexForUSD;
  };

  const getFreeSubscriptionPeriod = (): string => {
    const duration = servicePlanPricing[0]?.freeTrialDuration ?? 0;
    return duration === 12 ? t('oneYear') : `${duration} ${t('months')}`;
  };
  const isMobile = useDown(deviceBreakpoint.TABLET);
  const onlyTablet = useOnly(deviceBreakpoint.TABLET);
  const shouldDisplayPopularBanner = !!(servicePlanPricing && servicePlanPricing[0].banner);
  const indexUSD = findIndex();
  const servicePlansPricingInUSD = servicePlanPricing[indexUSD];
  const releaseHotfix = false;

  const setPlanPricingText = (pricing: number): string => {
    if (pricing === -1) return t('custom');
    return pricing.toString();
  };

  const getButtonText = (pricing: number): string => {
    if (pricing === 0) return t('signUpItsFree');
    if (pricing === -1) return t('contactSales');
    return t('getStarted');
  };

  useEffect(() => {
    sortData();
  }, [serviceBundles]);

  const isCustom = servicePlansPricingInUSD.actualPrice === -1;

  return (
    <View style={[styles.card, isMobile && styles.cardMobile, onlyTablet && styles.cardTablet]}>
      <View style={[styles.freeTierView, !shouldDisplayPopularBanner && styles.noBannerStyle]}>
        <Typography size="large" fontWeight="semiBold" variant="label" style={styles.mostPopularTag}>
          {servicePlanPricing[0].banner}
        </Typography>
      </View>
      <Typography size="large" fontWeight="semiBold" variant="label" style={styles.headerText}>
        {label}
      </Typography>
      <Typography size="small" variant="text" style={styles.headerLabel}>
        {description}
      </Typography>
      {releaseHotfix && servicePlanPricing && (
        <View style={styles.billingAmount}>
          <Typography size="small" variant="title" fontWeight="semiBold" style={styles.amount}>
            {isCustom ? null : servicePlansPricingInUSD.currency.currencySymbol}
            {setPlanPricingText(servicePlansPricingInUSD.actualPrice)}
          </Typography>
          <Typography size="small" variant="text" style={styles.perYearText}>
            {isCustom ? null : t('perYear')}
          </Typography>
        </View>
      )}
      {servicePlanPricing && servicePlanPricing[0].freeTrialDuration ? (
        <View style={styles.freeTierView}>
          <Typography size="large" variant="label" fontWeight="semiBold" style={styles.freeTierText}>
            {`${t('freeFor')}${getFreeSubscriptionPeriod()}`}
          </Typography>
        </View>
      ) : (
        <View style={styles.noBadge} />
      )}
      <Button
        title={getButtonText(servicePlansPricingInUSD.actualPrice)}
        type="primary"
        containerStyle={styles.getStartedButton}
      />
      {releaseHotfix && (
        <View style={styles.planList}>
          {serviceBundles &&
            serviceBundles.map((datum: any, index: number): React.ReactNode => {
              if (index < 5) {
                return <OrderedList label={datum.label} key={index} />;
              }
              return <></>;
            })}
        </View>
      )}
      <Typography size="regular" variant="label" style={styles.disclaimerText}>
        {t(disclaimerSectionText[name])}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 28,
    paddingTop: 25,
    paddingBottom: 20,
    width: 270,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowRadius: 120,
    position: 'relative',
  },
  cardMobile: {
    width: 290,
    paddingHorizontal: 28,
    marginHorizontal: 15,
  },
  cardTablet: {
    marginHorizontal: 20,
  },
  headerText: {
    alignItems: 'center',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingBottom: 8,
  },
  headerLabel: {
    textAlign: 'center',
    minHeight: 60,
    marginBottom: 24,
  },
  billingAmount: {
    flexDirection: 'row',
    alignContent: 'center',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  amount: {
    color: theme.colors.dark,
    textAlign: 'center',
  },
  perYearText: {
    paddingTop: 12,
    paddingLeft: 4,
    color: theme.colors.darkTint4,
    textAlign: 'center',
  },
  freeTierView: {
    alignItems: 'center',
    marginBottom: 16,
  },
  freeTierText: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.greenLightOpacity,
    borderRadius: 4,
    textAlign: 'center',
    color: theme.colors.green,
  },
  noBannerStyle: {
    opacity: 0,
    marginBottom: 32,
  },
  mostPopularTag: {
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: theme.colors.maroon,
    borderRadius: 2,
    textAlign: 'center',
    color: theme.colors.white,
    letterSpacing: 0.08,
    textTransform: 'uppercase',
    lineHeight: 16,
  },
  plansOrderedList: {
    marginBottom: 20,
  },
  disclaimerText: {
    textAlign: 'center',
    color: theme.colors.darkTint4,
    position: 'absolute',
    bottom: 20,
  },
  noBannerView: {
    height: 30,
    marginBottom: 16,
  },
  noBadge: {
    backgroundColor: theme.colors.green,
    opacity: 0,
    height: 30,
    marginTop: 16,
    width: '100%',
  },
  getStartedButton: {
    width: 240,
    marginTop: 12,
    marginBottom: 48,
  },
  planList: {
    marginTop: 12,
    marginBottom: 70,
  },
});

export default PlatformPlanCard;
