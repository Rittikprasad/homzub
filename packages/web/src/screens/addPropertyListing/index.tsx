import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CarouselProps } from 'react-multi-carousel';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { RouteNames, ScreensKeys } from '@homzhub/web/src/router/RouteNames';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import ContinuePopup from '@homzhub/web/src/components/molecules/ContinuePopup';
import PlanSelection from '@homzhub/common/src/components/organisms/PlanSelection';
import AddListingView from '@homzhub/web/src/screens/addPropertyListing/AddListingView';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

enum ComponentName {
  Listing_Plan_Selection = 'ListingPlanSelection',
  Add_Listing_Detail = 'AddListingDetail',
}

const CarouselResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1304 },
    items: 1,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1303, min: 1248 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1248, min: 768 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const customCarouselProps: CarouselProps = {
  children: undefined,
  arrows: false,
  draggable: true,
  focusOnSelect: false,
  renderButtonGroupOutside: true,
  responsive: CarouselResponsive,
  showDots: true,
};
export interface IListingProps {
  wasRedirected?: boolean;
  previousScreen?: string;
}

const AddPropertyListing = (): React.ReactElement => {
  const history = useHistory<IListingProps>();
  const {
    location: { state },
  } = history;
  const { t } = useTranslation();
  const [scene, setScene] = useState(ComponentName.Listing_Plan_Selection);
  const Desktop = useOnly(deviceBreakpoint.DESKTOP);
  const Mobile = useOnly(deviceBreakpoint.MOBILE);
  const Tablet = useOnly(deviceBreakpoint.TABLET);

  useEffect(() => {
    if (state) {
      const { previousScreen } = state;
      if (previousScreen && previousScreen === ScreensKeys.Dashboard) {
        setScene(ComponentName.Add_Listing_Detail);
      }
    }
  });

  // TODO: remove the commented code once the API issue from chrome is resolved

  //  const [banners, setBanners] = useState<AssetAdvertisement>();
  // useEffect(() => {
  //   const requestPayload = {
  //     category: 'service',
  //   };
  //   DashboardRepository.getAdvertisements(requestPayload)
  //     .then((response) => {
  //       console.log('res ===> ', response);
  //       setBanners(response);
  //     })
  //     .catch((e) => {
  //       console.log('err===>', e);
  //       const error = ErrorUtils.getErrorMessage(e.details);
  //       AlertHelper.error({ message: error });
  //     });
  // }, []);

  const navigateToDashboard = (): void => {
    NavigationService.navigate(history, { path: RouteNames.protectedRoutes.DASHBOARD });
  };

  const renderScene = (): React.ReactElement | null => {
    switch (scene) {
      case ComponentName.Listing_Plan_Selection:
        return (
          <PlanSelection
            carouselView={renderCarousel()}
            onSelectPlan={handlePlanSelection}
            onSkip={navigateToDashboard}
            isDesktop={Desktop}
            isMobile={Mobile}
            isTablet={Tablet}
          />
        );
      case ComponentName.Add_Listing_Detail:
        return (
          <AddListingView
            onUploadDocument={FunctionUtils.noop}
            isDesktop={Desktop}
            isMobile={Mobile}
            isTablet={Tablet}
            history={history}
          />
        );
      default:
        return null;
    }
  };

  const renderCarousel = (): React.ReactElement => {
    const popupDetails = {
      title: t('common:congratulations'),
      subTitle: t('property:yourDetailsAdded'),
      buttonSubText: t('property:clickContinue'),
      buttonTitle: t('common:continue'),
    };
    return (
      <View style={[styles.carouselView, Mobile && styles.carouselViewMobile]}>
        <MultiCarousel passedProps={customCarouselProps}>
          {/* {banners?.results.map((item) => ( */}
          <View style={styles.imageContainer}>
            <Image
              style={[styles.image, Tablet && styles.imageTablet, Mobile && styles.imageMobile]}
              resizeMode="contain"
              source={{
                uri: 'https://homzhub-bucket.s3.amazonaws.com/f205f192f15d49fa994632d641463fb2.svg',
              }}
              // source={{ uri: item.attachment.link }}        //Same todo as above
            />
          </View>
          {/* // ))} */}
        </MultiCarousel>
        {state && state.wasRedirected && (
          <ContinuePopup isOpen isSvg={false} {...popupDetails} onContinueRoute={null} />
        )}
      </View>
    );
  };

  const handlePlanSelection = (): void => {
    setScene(ComponentName.Add_Listing_Detail);
  };

  return <View style={styles.container}>{renderScene()}</View>;
};

export default AddPropertyListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  carouselView: {
    backgroundColor: theme.colors.white,
    flex: 1,
    marginLeft: 12,
    height: 'fit-content',
    paddingBottom: 12,
  },
  carouselViewMobile: {
    marginTop: 20,
    marginLeft: 0,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  image: {
    width: 525,
    height: 330,
    marginVertical: '12px',
  },
  imageMobile: {
    width: 300,
    height: 280,
    margin: 'auto',
  },
  imageTablet: {
    width: 340,
    marginVertical: '48px',
  },
});
