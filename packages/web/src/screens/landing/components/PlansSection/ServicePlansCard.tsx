import React, { FC } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import CardWithIcon from '@homzhub/web/src/components/atoms/CardWithIcon';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  servicePlansList: ServicePlans[];
  servicePlansCardStyle: ViewStyle;
  cardStyle?: ViewStyle;
  children?: React.ReactNode;
}

const ServicePlansCard: FC<IProps> = (props: IProps) => {
  const { servicePlansList, servicePlansCardStyle, cardStyle = {} } = props;
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const { t } = useTranslation();
  const { appHistory } = NavigationService;
  const onPressLearn = (planId: string): void => {
    NavigationService.navigate(appHistory, {
      path: RouteNames.publicRoutes.SERVICE_PLANS_DETAIL.replace(':plansId', `${planId}`),
      params: {
        planId,
      },
    });
  };
  return (
    <View style={servicePlansCardStyle}>
      {servicePlansList.map((plans) => (
        <CardWithIcon
          cardImage={plans.attachment.link}
          cardTitle={plans.label}
          cardDescription={plans.description}
          key={`service-plan-${plans.id}`}
          cardStyle={[isDesktop ? styles.servicePlansCard : styles.servicePlansCardMobile, cardStyle]}
        >
          <View>
            <Button
              type="primary"
              title={t('landing:learnMore')}
              containerStyle={styles.buttonLearnMore}
              icon={icons.launchRedirect}
              iconSize={20}
              iconColor={theme.colors.white}
              iconStyle={styles.buttonIconStyle}
              titleStyle={styles.buttonTextStyle}
              onPress={(): void => onPressLearn(plans.id)}
            />
          </View>
        </CardWithIcon>
      ))}
    </View>
  );
};
export default ServicePlansCard;

const styles = StyleSheet.create({
  servicePlansCard: {
    width: '20%',
  },
  servicePlansCardMobile: {
    width: 270,
  },
  buttonLearnMore: {
    width: 150,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonTextStyle: {
    fontWeight: 'normal',
    fontSize: 14,
    marginHorizontal: 15,
  },
  buttonIconStyle: {
    paddingRight: '12.5%',
  },
});
