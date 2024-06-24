import React, { FC, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { useDown, useViewPort } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import AppFeatures from '@homzhub/web/src/screens/landing/components/AppFeatures';
import FooterWithSocialMedia from '@homzhub/web/src/screens/landing/components/FooterWithSocialMedia';
import HeroSection from '@homzhub/web/src/screens/landing/components/HeroSection';
import LandingFeatures from '@homzhub/web/src/screens/landing/components/LandingFeatures';
import LandingNavBar from '@homzhub/web/src/screens/landing/components/LandingNavBar';
import { LandingYoutubeSection } from '@homzhub/web/src/screens/landing/components/LandingYoutubeSection';
import OurServicesSection from '@homzhub/web/src/screens/landing/components/OurServicesSection';
import PlansSection from '@homzhub/web/src/screens/landing/components/PlansSection';
import PromiseSection from '@homzhub/web/src/screens/landing/components/PromiseSection';
import { StoreLinkSection } from '@homzhub/web/src/screens/landing/components/StoreLinksSection';
import SubscribePopUp from '@homzhub/web/src/screens/landing/components/SubscribePopUp';
import Testimonials from '@homzhub/web/src/screens/landing/components/Testimonials';
import { IDynamicLinkParams } from '@homzhub/web/src/services/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps extends RouteComponentProps {
  isAuthenticated: boolean;
  dynamicLinkParams?: IDynamicLinkParams;
}

const Landing: FC<IProps> = (props: IProps) => {
  const { isAuthenticated, history, dynamicLinkParams } = props;
  const [storeLinksRef, setStoreLinksRef] = useState(null);
  const dispatch = useDispatch();
  const storeLinkSectionRef = (element: any): void => {
    setStoreLinksRef(element);
  };
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (dynamicLinkParams?.type?.length) {
      NavigationService.handleDynamicLinkNavigation(dynamicLinkParams);
    } else if (isAuthenticated) {
      NavigationService.navigate(history, {
        path: RouteNames.protectedRoutes.DASHBOARD,
      });
    }
  }, []);
  useEffect(() => {
    dispatch(CommonActions.getCountries());
    dispatch(CommonActions.setDeviceCountry('IN'));
    setIsInitialized(true);
  }, [isInitialized]);
  return (
    <View style={styles.container}>
      <ExitTriggeredPopup isInitialized={isInitialized} />
      <LandingNavBar storeLinksSectionRef={storeLinksRef} />
      <HeroSection />
      <LandingFeatures />
      <AppFeatures />
      <PromiseSection />
      <LandingYoutubeSection />
      <PlansSection />
      <StoreLinkSection scrollRef={storeLinkSectionRef} />
      <Testimonials />
      <OurServicesSection />
      <FooterWithSocialMedia />
    </View>
  );
};
interface IExitPopupProps {
  isInitialized: boolean;
}
const ExitTriggeredPopup = (props: IExitPopupProps): React.ReactElement<IExitPopupProps> => {
  const { isInitialized } = props;
  const popupRef = useRef<PopupActions>(null);
  const totalWidth = useViewPort().width;
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  let plzSubscribedTimer: NodeJS.Timeout;
  const handlePopup = (e: MouseEvent): void => {
    if (!e.relatedTarget) {
      if (popupRef && popupRef.current) {
        popupRef.current.open();
      }
    }
  };
  const handlePopupClose = (): void => {
    if (popupRef && popupRef.current) {
      popupRef.current.close();
      clearTimeout(plzSubscribedTimer);
      document.removeEventListener('mouseout', handlePopup);
    }
  };
  useEffect(() => {
    const DELAY_POPUP_DISPLAY_TIME = 600000;
    plzSubscribedTimer = setTimeout(() => {
      if (popupRef && popupRef.current) {
        popupRef.current.open();
      }
    }, DELAY_POPUP_DISPLAY_TIME);
    document.addEventListener('mouseout', handlePopup);
    return (): void => {
      document.removeEventListener('mouseout', handlePopup);
      clearTimeout(plzSubscribedTimer);
    };
  }, [isInitialized]);
  const scaleX = isTablet ? (isMobile ? 0.9 : 0.7) : 0.5;
  const containerStyle = {
    width: totalWidth * scaleX,
    maxWidth: 'fit-content',
  };
  return (
    <Popover
      forwardedRef={popupRef}
      content={<SubscribePopUp handlePopupClose={handlePopupClose} />}
      popupProps={{
        closeOnDocumentClick: true,
        children: undefined,
        modal: true,
        onClose: handlePopupClose,
        contentStyle: containerStyle,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
});

export default Landing;
