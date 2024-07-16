import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown, useIsIpadPro, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import PlatformPlanCard from '@homzhub/web/src/screens/membershipPlans/components/PlatformPlansCard';
import PlatformPlansTab from '@homzhub/web/src/screens/membershipPlans/components/PlatformPlansTab';
import PlatformPlansWeb from '@homzhub/web/src/screens/membershipPlans/components/PlatformPlansWeb';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PlatformPlan: FC = () => {
  const [platformPlansData, setPlatformPlansData] = useState<PlatformPlans[]>([]);

  useEffect(() => {
    getServicePlans();
  }, []);

  const getServicePlans = async (): Promise<void> => {
    try {
      const response: PlatformPlans[] = await ServiceRepository.getPlatformPlans();
      setPlatformPlansData(response);
    } catch (e: any) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTab = useDown(deviceBreakpoint.TABLET);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const isIPadPro = useIsIpadPro();
  const { t } = useTranslation();
  return (
    <View style={[styles.container, (isTab || isIPadPro) && styles.containerTab]}>
      {platformPlansData.length &&
        (isLaptop && !isIPadPro ? (
          <PlatformPlansWeb platformPlansData={platformPlansData} />
        ) : (
          <View>
            <View style={styles.platformCardGroup}>
              <PlatformPlanCard platformPlansData={platformPlansData} />
            </View>
            <View style={styles.background}>
              <Typography
                fontWeight="semiBold"
                variant={isMobile ? 'text' : 'title'}
                size={isMobile ? 'large' : 'small'}
                style={styles.heading}
              >
                {t('common:features')}
              </Typography>
              <PlatformPlansTab platformPlansData={platformPlansData} />
            </View>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '4%',
    paddingBottom: '10%',
  },
  background: {
    backgroundColor: theme.colors.white,
    paddingBottom: '10%',
  },
  heading: {
    textAlign: 'center',
    marginTop: '6%',
    marginBottom: '5%',
  },
  platformCardGroup: {
    marginBottom: 30,
  },
  containerTab: {
    paddingBottom: '0%',
  },
});

export default PlatformPlan;
