import React, { useState } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { ButtonGroupProps } from 'react-multi-carousel';
import { icons } from '@homzhub/common/src/assets/icon';
import { NextPrevBtn } from '@homzhub/web/src/components';

interface IProps<T> {
  carouselData: T[];
  containerStyle: ViewStyle;
  iconColor: string;
  iconStyle: StyleProp<ViewStyle>;
}

type Props<T> = IProps<T> & ButtonGroupProps;

function CarouselControlButtons<T>({
  next,
  previous,
  carouselData,
  containerStyle,
  iconColor,
  iconStyle,
}: Props<T>): React.ReactElement {
  const [currentSlide, setCurrentSlide] = useState(0);

  const updateCarouselIndex = (updateIndexBy: number): void => {
    if (updateIndexBy === 1 && next) {
      next();
      if (currentSlide === carouselData.length - 1) {
        setCurrentSlide(0);
      } else {
        setCurrentSlide(currentSlide + 1);
      }
    } else if (updateIndexBy === -1 && previous) {
      previous();
      if (currentSlide === 0) {
        setCurrentSlide(carouselData.length - 1);
      } else {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };
  return (
    <View style={containerStyle}>
      <NextPrevBtn
        leftBtnProps={{
          icon: icons.longArrowLeft,
          iconSize: 20,
          iconColor,
          containerStyle: iconStyle,
        }}
        rightBtnProps={{
          icon: icons.longArrowRight,
          iconSize: 20,
          iconColor,
          containerStyle: iconStyle,
        }}
        onBtnClick={updateCarouselIndex}
      />
    </View>
  );
}
export default CarouselControlButtons;
