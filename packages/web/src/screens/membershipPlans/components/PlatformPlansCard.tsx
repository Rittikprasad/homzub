import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { PixelEventType, PixelService } from '@homzhub/web/src/services/PixelService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';
import { ServicePlanPricing } from '@homzhub/common/src/domain/models/ServicePlanPricing';

interface IProps {
  platformPlansData: PlatformPlans[];
}

const PlatformPlansCard: React.FC<IProps> = (props: IProps) => {
  const { platformPlansData } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const navigationToSignup = (): void => {
    PixelService.ReactPixel.track(PixelEventType.Subscribe);
    NavigationService.navigate(history, {
      path: RouteNames.publicRoutes.SIGNUP,
    });
  };
  const getFreeSubscriptionPeriod = (data: ServicePlanPricing[]): string => {
    const duration = data[0].freeTrialDuration ?? 0;
    return duration === 12 ? t('oneYear') : `${duration} ${t('months')}`;
  };

  const availablePrice = (servicePlans: PlatformPlans): React.ReactElement => {
    const price = servicePlans.servicePlanPricing.filter((item) => item.currency.currencyCode === 'USD');
    if (servicePlans.name === 'FREEDOM')
      return (
        <View style={styles.cardPricing}>
          <Typography variant="text" size="small" fontWeight="semiBold">
            {t('common:free')}
          </Typography>
        </View>
      );
    if (servicePlans.name === 'PRO' || servicePlans.name === 'PREMIUM')
      return (
        <View style={styles.cardPricing}>
          {price[0].freeTrialDuration ? (
            <View style={styles.freeTierView}>
              <Typography size="large" variant="label" fontWeight="semiBold" style={styles.freeTierText}>
                {`${t('freeFor')}${getFreeSubscriptionPeriod(price)}`}
              </Typography>
            </View>
          ) : (
            <View style={styles.pricing}>
              <Typography variant="text" size="small" fontWeight="semiBold">
                {price[0].currency.currencySymbol}
                {price[0].actualPrice}
              </Typography>
              <Typography variant="text" size="small">
                {t('common:perYear')}
              </Typography>
            </View>
          )}
        </View>
      );
    return (
      <View style={styles.cardPricing}>
        <Typography variant="text" size="small" fontWeight="semiBold" style={styles.primary}>
          {t('common:contactUs')}
        </Typography>
      </View>
    );
  };
  return (
    <View style={styles.cardGroupContainer}>
      {platformPlansData
        .sort((a, b) => Number(a.tier) - Number(b.tier))
        .map((item: PlatformPlans) => (
          <View style={styles.cardContainer} key={item.id}>
            <View>
              <Typography variant="text" size="regular" fontWeight="bold">
                {t(item.label)}
              </Typography>
            </View>
            <View style={styles.cardDescription}>
              <Typography variant="text" size="small" style={styles.subTextColor}>
                {t(item.description)}
              </Typography>
            </View>
            {availablePrice(item)}
            <Button
              type="primary"
              title={
                item.name !== 'FREEDOM'
                  ? item.name === 'PRO' || item.name === 'PREMIUM'
                    ? t('common:getStarted')
                    : t('common:contactSales')
                  : t('common:freeSignUp')
              }
              containerStyle={styles.buttonContainerStyle}
              titleStyle={styles.buttonTitleStyle}
              onPress={navigationToSignup}
            />
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cardGroupContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'scroll',
    marginHorizontal: '15px',
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    height: '253px',
    width: '255px',
    backgroundColor: theme.colors.white,
    padding: '30px',
    marginHorizontal: '15px',
    shadowColor: theme.colors.landingCardShadow,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.06,
  },
  cardContainerHoverIn: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.colors.lowPriority,
  },
  cardDescription: {
    minHeight: '75px',
  },
  subTextColor: {
    color: theme.colors.darkTint3,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  cardPricing: {
    flexDirection: 'row',
    paddingBottom: '20px',
  },
  buttonContainerStyle: {
    position: 'absolute',
    bottom: 24,
    width: '80%',
  },
  buttonTitleStyle: {
    marginHorizontal: 10,
  },
  primary: {
    color: theme.colors.primaryColor,
  },
  freeTierView: {
    alignItems: 'center',
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
  pricing: {
    paddingTop: '8px',
    paddingBottom: '12px',
  },
});

export default PlatformPlansCard;
