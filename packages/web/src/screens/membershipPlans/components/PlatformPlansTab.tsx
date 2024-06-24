import React, { FC, ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import '@homzhub/web/src/screens/membershipPlans/components/PlatformPlansTab.scss';

interface IProp {
  platformPlansData: PlatformPlans[];
}
const PlatformPlansTab: FC<IProp> = (props: IProp) => {
  const { platformPlansData } = props;
  const [servicePlan, setServicePlan] = useState<PlatformPlans[]>([]);
  const [featureList, setFeatureList] = useState<ServiceBundleItems[]>([]);
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  useEffect(() => {
    getFeatureList(platformPlansData);
  }, []);

  const getFeatureList = (response: PlatformPlans[]): void => {
    setServicePlan(response.sort((a, b) => Number(a.id) - Number(b.id)));
    const data = response.filter((plan) => plan.name === 'PRO');
    setFeatureList(data[0].servicePlanBundle);
  };

  const firstLetterUpperCase = (theString: string): string => {
    return theString?.charAt(0).toUpperCase() + theString?.slice(1) || ' ';
  };
  const availableFeature = (label: ServiceBundleItems, servicePlans: PlatformPlans): ReactElement => {
    const data = servicePlans.servicePlanBundle.filter((feature) => feature.name === label.name);
    if (data.length !== 0) {
      return (
        <td className="header-cards">
          <p style={{ margin: 5 }}>
            <Typography variant="label" size={!isMobile ? 'regular' : 'small'} style={styles.plans}>
              {t(servicePlans.label)}
            </Typography>
          </p>
          <Icon name={icons.checkFilled} size={16} color={theme.colors.green} />
        </td>
      );
    }
    return (
      <td className="header-cards">
        <p style={{ margin: 5 }}>
          <Typography variant="label" size={!isMobile ? 'regular' : 'small'} style={styles.plans}>
            {t(servicePlans.label)}
          </Typography>
        </p>
        <Icon name={icons.close} size={16} color={theme.colors.danger} />
      </td>
    );
  };
  const extractString = (stringData: string): ReactElement | null => {
    const regExp = /\(([^)]+)\)/;
    const subHeading = regExp.exec(stringData);
    if (subHeading !== null) {
      return (
        <p className="feature-text">
          <Typography variant="label" size={!isMobile ? 'large' : 'regular'} style={styles.subTextColor}>
            {firstLetterUpperCase(t(subHeading[1]))}
          </Typography>
        </p>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <div className="table-container">
        <table className="table-tab">
          {featureList.map((item: ServiceBundleItems) => (
            <>
              <tr className="header-row" key={item.id}>
                <td className="header-title" colSpan={4}>
                  <p className="heading-section">
                    <p className="feature-heading">
                      <Typography variant={!isMobile ? 'text' : 'label'} size={!isMobile ? 'small' : 'large'}>
                        {t(item.label.split('(')[0])}
                      </Typography>
                    </p>
                    {extractString(item.label)}
                  </p>
                </td>
              </tr>
              <tr className="feature-row">{servicePlan?.map((data: PlatformPlans) => availableFeature(item, data))}</tr>
            </>
          ))}
        </table>
      </div>
    </View>
  );
};
export default PlatformPlansTab;

const styles = StyleSheet.create({
  container: {
    width: '91vw',
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: {
      height: 42,
      width: 0,
    },
    shadowRadius: 120,
    marginHorizontal: 'auto',
  },
  subTextColor: {
    color: theme.colors.darkTint3,
  },
  space: {
    paddingLeft: 8,
  },
  buttonTitleStyle: {
    marginHorizontal: 10,
  },
  primary: {
    color: theme.colors.primaryColor,
  },
  plans: {
    color: theme.colors.darkTint7,
  },
});
