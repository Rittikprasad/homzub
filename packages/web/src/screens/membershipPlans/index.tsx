import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation, Trans } from 'react-i18next';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { GradientBackground } from '@homzhub/web/src/screens/landing/components/GradientBackground';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import FooterWithSocialMedia from '@homzhub/web/src/screens/landing/components/FooterWithSocialMedia';
import LandingNavBar from '@homzhub/web/src/screens/landing/components/LandingNavBar';
import PlatformPlan from '@homzhub/web/src/screens/membershipPlans/components/PlatformPlan';
import ServicePlansSection from '@homzhub/web/src/screens/membershipPlans/components/ServicePlansSection';
import OurServicesSection from '@homzhub/web/src/screens/landing/components/OurServicesSection';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const MembershipPlans: FC = () => {
  const [isPlatformPlan, setIsPlatformPlan] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTab = useOnly(deviceBreakpoint.TABLET);

  const onTabChange = (argSelectedTab: number): void => {
    setSelectedTab(argSelectedTab);
    setIsPlatformPlan(!isPlatformPlan);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <View style={styles.container}>
      <LandingNavBar membershipPlan />
      <View>
        <GradientBackground>
          <Typography
            fontWeight="semiBold"
            variant={isMobile ? 'text' : 'title'}
            size={isTab ? 'regular' : 'large'}
            style={[styles.header, isTab && styles.headerTab, isMobile && styles.headerMobile]}
          >
            {t('common:plansSectionHeader')}
          </Typography>
        </GradientBackground>
      </View>
      <View style={styles.button}>
        <SelectionPicker
          data={[
            { title: t('landing:servicePlans'), value: 0 },
            { title: t('landing:platformPlans'), value: 1 },
          ]}
          selectedItem={[selectedTab]}
          onValueChange={onTabChange}
          itemWidth={!isMobile ? 210 : 150}
          containerStyles={styles.pickerContainer}
          primary={false}
        />
        {!isMobile && (
          <Typography fontWeight="regular" variant="text" size="small" style={styles.subText}>
            {isPlatformPlan ? (
              t('landing:platformPlansHeader')
            ) : (
              <Trans components={{ italic: <i /> }}>{t('landing:servicePlansHeader')}</Trans>
            )}
          </Typography>
        )}
      </View>

      {isPlatformPlan ? <PlatformPlan /> : <ServicePlansSection />}
      <View style={[!isPlatformPlan && isMobile && styles.footerMobile, !isPlatformPlan && isTab && styles.footerTab]}>
        <OurServicesSection />
        <FooterWithSocialMedia />
      </View>
    </View>
  );
};
export default MembershipPlans;
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  buttonContainer: {
    width: '210px',
    height: 46,
  },
  button: { paddingTop: 60, bottom: 10, alignItems: 'center' },
  header: {
    marginTop: 125,
    marginBottom: 80,
    marginHorizontal: 'auto',
    color: theme.colors.white,
    textAlign: 'center',
  },
  headerTab: {
    marginTop: 117,
    marginBottom: 72,
  },
  headerMobile: {
    marginTop: 87,
    marginBottom: 42,
    lineHeight: 36,
  },
  subText: {
    marginTop: 34,
    marginHorizontal: 'auto',
  },
  pickerContainer: {
    height: 54,
  },
  footerMobile: {
    marginTop: '0%',
  },
  footerTab: {
    marginTop: '-8%',
  },
});
