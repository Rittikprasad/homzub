import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import ServicePlansSection from '@homzhub/web/src/screens/landing/components/PlansSection/ServicePlansSection';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const HomzhubServices: FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  const navigateToScreen = (path: string): void => {
    NavigationService.navigate(history, { path });
  };
  return (
    <View style={styles.services}>
      <ServicePlansSection cardStyle={styles.servicePlansCardStyle} scrollStyle={styles.scrollStyle} />
      <Button
        type="primary"
        title={t('signUp')}
        onPress={(): void => navigateToScreen(RouteNames.publicRoutes.SIGNUP)}
        containerStyle={[styles.button, isMobile && styles.buttonMobile]}
      />
    </View>
  );
};

export default HomzhubServices;

const styles = StyleSheet.create({
  servicePlansCardStyle: {
    width: '28%',
    minHeight: 250,
  },
  servicePlansCardsContainer: {
    backgroundColor: theme.colors.background,
  },
  services: {
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '5%',
    marginHorizontal: 2,
  },
  text: {
    textAlign: 'center',
  },
  subHeading: {
    top: 20,
  },
  button: {
    width: 238,
    marginBottom: '6%',
  },
  scrollStyle: {
    marginBottom: 20,
    top: 20,
  },
  buttonMobile: {
    marginBottom: '17%',
  },
});
