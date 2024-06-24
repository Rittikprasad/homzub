import React, { FC, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Carousel, { CarouselProps } from 'react-multi-carousel';
import { useDown, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import SideBar from '@homzhub/web/src/components/molecules/Drawer/BurgerMenu';
import { SignupCarousalCard } from '@homzhub/web/src/components/organisms/GetToKnowUsCarousel/SignupCarousalCard';
import { ImageData, IImageDataProps } from '@homzhub/common/src/constants/Signup';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
// Gettoknow
export const GetToKnowUsCarousel: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  const carousalRef = useRef<Carousel>(null);
  const onMenuClose = (): void => {
    setIsOpen(false);
  };
  const onMenuOpen = (): void => {
    if (carousalRef && carousalRef.current) {
      carousalRef.current?.goToSlide(0);
    }
    setIsOpen(true);
  };

  const CarouselResponsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1304 },
      items: 1,
      slidesToSlide: 1,
    },
    desktop: {
      breakpoint: { max: 1303, min: 1248 },
      items: 1,
      slidesToSlide: 1,
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
  const menuProps = {
    menuClassName: 'signupMenu', // FIXME @ashwin-kartik
    burgerButtonClassName: 'menuButton', // FIXME @ashwin-kartik
    width: isMobile ? 320 : 460,
    right: true,
  };

  const renderCarousel = (): React.ReactElement => {
    return (
      <View style={styles.carousal}>
        <MultiCarousel passedProps={customCarouselProps} forwardRef={carousalRef}>
          {ImageData.map((item: IImageDataProps) => (
            <SignupCarousalCard key={item.id} id={item.id} value={item.image} />
          ))}
        </MultiCarousel>
      </View>
    );
  };
  return (
    <View style={[styles.container, !isLaptop && styles.mobileContainer]}>
      {isLaptop ? (
        renderCarousel()
      ) : (
        <Button
          containerStyle={styles.buttonContainer}
          type="text"
          icon={icons.info}
          iconSize={30}
          iconColor={theme.colors.darkTint2}
          onPress={onMenuOpen}
        />
      )}

      {!isLaptop && (
        <SideBar open={isOpen} menuProps={menuProps} onClose={onMenuClose}>
          {renderCarousel()}
        </SideBar>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '55%',
  },
  mobileContainer: {
    width: 0,
  },
  carousal: {
    width: '100%',
    marginRight: -16,
    backgroundColor: theme.colors.carousalBackground,
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    top: '30px',
    right: '20px',
  },
});
