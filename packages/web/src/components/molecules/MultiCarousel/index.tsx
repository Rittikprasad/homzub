import React, { FC } from 'react';
import Carousel, { CarouselProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '@homzhub/web/src/components/molecules/MultiCarousel/MultiCarousel.scss';

interface IProps {
  children?: React.ReactNode;
  passedProps?: CarouselProps;
  forwardRef?: React.Ref<Carousel>;
}

const defaultResponsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1440 },
    items: 4,
    slidesToSlide: 2,
  },
  desktop: {
    breakpoint: { max: 1440, min: 1248 },
    items: 3,
    slidesToSlide: 3,
  },
  laptop: {
    breakpoint: { max: 1247, min: 1024 },
    items: 2,
    slidesToSlide: 2,
  },
  tablet: {
    breakpoint: { max: 1023, min: 768 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const MultiCarousel: FC<IProps> = (props: IProps) => {
  const { children, passedProps, forwardRef } = props;
  const defaultProps = {
    arrows: false,
    autoPlay: false,
    autoPlaySpeed: 3000,
    draggable: true,
    focusOnSelect: false,
    infinite: true,
    renderDotsOutside: true,
    responsive: defaultResponsive,
    showDots: true,
  };
  const carouselProps = passedProps ?? defaultProps;
  return (
    <Carousel {...carouselProps} ref={forwardRef}>
      {children ?? <></>}
    </Carousel>
  );
};

export default MultiCarousel;
