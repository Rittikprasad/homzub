import React, { FC, useState, useEffect } from 'react';
import { View } from 'react-native';
import MetaTags from '@homzhub/web/src/components/atoms/MetaTags';
import LandingNavBar from '@homzhub/web/src/screens/landing/components/LandingNavBar';
import BannerVideo from '@homzhub/web/src/screens/microSite/components/BannerVideo';
import Properties from '@homzhub/web/src/screens/microSite/components/Properties';
import HomzhubServices from '@homzhub/web/src/screens/microSite/components/HomzhubServices';
import OverViewSteps from '@homzhub/web/src/screens/microSite/components/OverViewSteps';
import StartYourInvestment from '@homzhub/web/src/screens/microSite/components/StartYourInvestment';
import Testimonials from '@homzhub/web/src/screens/microSite/components/Testimonials';
import OurServicesSection from '@homzhub/web/src/screens/landing/components/OurServicesSection';
import FooterWithSocialMedia from '@homzhub/web/src/screens/landing/components/FooterWithSocialMedia';

const MicroSite: FC = () => {
  const [storeLinksRef, setStoreLinksRef] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const storeLinkSectionRef = (element: any): void => {
    setStoreLinksRef(element);
  };
  useEffect(() => {
    setIsInitialized(true);
  }, [isInitialized]);
  return (
    <View>
      <MetaTags title="Maharashtra Connect" />
      <LandingNavBar storeLinksSectionRef={storeLinksRef} />
      <BannerVideo />
      <OverViewSteps />
      <HomzhubServices />
      <StartYourInvestment />
      <Properties />
      <Testimonials />
      <OurServicesSection scrollRef={storeLinkSectionRef} />
      <FooterWithSocialMedia />
    </View>
  );
};

export default MicroSite;
