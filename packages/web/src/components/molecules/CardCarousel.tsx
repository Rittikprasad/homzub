import React, { FC, useState, createRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel, { ButtonGroupProps, CarouselProps } from 'react-multi-carousel';

import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { ImageVideoPagination } from '@homzhub/common/src/components/atoms/ImageVideoPagination';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import { NextPrevBtn } from '@homzhub/web/src/components/molecules/NextPrevBtn';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

interface IProps {
  data: Attachment[];
}
const defaultResponsive = {
  desktop: {
    breakpoint: {
      max: 3840,
      min: 0,
    },
    items: 1,
    slidesToSlide: 1,
  },
};

const CardCarousel: FC<IProps> = (props: IProps) => {
  const { data } = props;
  const [showPopover, setShowPopover] = useState(false);
  const [active, setActive] = useState(0);
  const currentSlide: Attachment = data[active];
  const handleShowPopover = (): void => {
    setShowPopover(true);
  };
  const onClosePopover = (): void => {
    setShowPopover(false);
  };
  const popOverContentStyle = {
    width: '100%',
    height: '260px',
    alignItems: 'center',
  };
  const popOverOverlayStyle = {
    background: theme.colors.lightOpacity,
  };
  const activeSlideHandle = (currentImage: number): void => {
    setActive(currentImage);
  };
  const carouselRef = createRef<Carousel>();
  const carouselProps: CarouselProps = {
    children: undefined,
    arrows: false,
    autoPlay: false,
    draggable: true,
    focusOnSelect: false,
    infinite: true,
    renderButtonGroupOutside: true,
    customButtonGroup: <CarouselButtons activeSlide={activeSlideHandle} data={data} />,
    responsive: defaultResponsive,
    showDots: false,
  };
  const renderPopOverContent = (): React.ReactElement => {
    return (
      <MultiCarousel forwardRef={carouselRef} passedProps={carouselProps}>
        {renderPropertyImages()}
      </MultiCarousel>
    );
  };
  const renderPropertyImages = (): React.ReactNode => {
    return data.map((currentImage: Attachment, index: number) => {
      return (
        <>
          <View>
            <Icon name={icons.heartOutline} size={20} style={styles.favouriteIcon} color={theme.colors.white} />
          </View>

          <View style={styles.fullimage}>
            <Image
              style={styles.imagePopup}
              source={{
                uri: currentImage.link,
              }}
            />
          </View>
        </>
      );
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.cardImageCrousel}>
        <MultiCarousel passedProps={carouselProps}>
          {data.map((item) => (
            <TouchableOpacity onPress={handleShowPopover} key={item.id}>
              <View>
                <Image
                  style={[styles.image]}
                  source={{
                    uri: item.link,
                  }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </MultiCarousel>
      </View>
      <Popover
        content={renderPopOverContent}
        popupProps={{
          open: showPopover,
          onClose: onClosePopover,
          modal: true,
          arrow: false,
          contentStyle: popOverContentStyle,
          closeOnDocumentClick: true,
          children: undefined,
          overlayStyle: popOverOverlayStyle,
        }}
      />

      {data.length > 1 && (
        <View style={styles.pagination}>
          <ImageVideoPagination
            totalSlides={data.length}
            currentSlide={active}
            type={currentSlide?.mediaType ?? 'IMAGE'}
          />
        </View>
      )}
    </View>
  );
};

interface ICarouselButtons {
  activeSlide: (currentImage: number) => void;
  data: Attachment[];
}
type Props = ICarouselButtons & ButtonGroupProps;
const CarouselButtons = (props: Props): React.ReactElement => {
  const { next, previous, data, activeSlide } = props;
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    activeSlide(currentImage);
  }, [currentImage]);
  const updateCarouselIndex = (updateIndexBy: number): void => {
    if (updateIndexBy === 1 && next) {
      next();
      if (currentImage === data.length - 1) {
        setCurrentImage(0);
      } else {
        setCurrentImage(currentImage + 1);
      }
    } else if (updateIndexBy === -1 && previous) {
      previous();
      if (currentImage === 0) {
        setCurrentImage(data.length - 1);
      } else {
        setCurrentImage(currentImage - 1);
      }
    }
  };

  return (
    <>
      <NextPrevBtn
        leftBtnProps={{
          icon: icons.leftArrow,
          iconSize: 20,
          iconColor: theme.colors.white,
          containerStyle: [styles.leftRightButtons, styles.leftButton],
        }}
        rightBtnProps={{
          icon: icons.rightArrow,
          iconSize: 20,
          iconColor: theme.colors.white,
          containerStyle: [styles.leftRightButtons, styles.rightButton],
        }}
        onBtnClick={updateCarouselIndex}
      />
      <Icon name={icons.heartOutline} size={20} style={styles.favouriteIcon} color={theme.colors.white} />
    </>
  );
};

export default CardCarousel;

const styles = StyleSheet.create({
  cardImageCrousel: {
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
  },
  image: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: '100%',
    height: 210,
  },
  imagePopup: {
    justifyContent: 'center',
    borderRadius: 4,
    width: '100%',
    height: '100%',
  },
  leftRightButtons: {
    borderWidth: 0,
    position: 'absolute',
    width: 'fitContent',
    backgroundColor: theme.colors.transparent,
    top: 100,
  },
  leftButton: {
    left: 0,
  },
  rightButton: {
    left: '94%',
  },
  favouriteIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  propertyHighlightLabelContainer: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    borderRadius: 2,
    backgroundColor: theme.colors.imageVideoPaginationBackground,
  },
  propertyHighlightLabel: {
    color: theme.colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  fullimage: {
    height: 260,
    width: '100%',
    resizeMode: 'contain',
  },
  pagination: {
    position: 'absolute',
    top: 175,
    marginHorizontal: '20',
  },
});
