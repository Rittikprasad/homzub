import React, { useState } from 'react';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import TestimonialsMobile from '@homzhub/web/src/screens/landing/components/Testimonials/TestimonialsMobile';
import TestimonialsDesktop from '@homzhub/web/src/screens/landing/components/Testimonials/TestimonialsDesktop';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { TestimonialData as data } from '@homzhub/common/src/constants/LandingScreen';

export interface ITestimonialProps {
  onLeftNavClick: () => void;
  onRightNavClick: () => void;
  data: ITestimonialData[];
  testimonialIndex: number;
}
interface ITestimonialData {
  name: string;
  designation: string;
  review: string;
  description: string;
  image: string;
}

const Testimonials: React.FC = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const onLeftNavClick = (): void => {
    if (testimonialIndex === 0) {
      setTestimonialIndex(data.length - 1);
    } else {
      setTestimonialIndex((prevState) => prevState - 1);
    }
  };
  const onRightNavClick = (): void => {
    if (testimonialIndex === data.length - 1) {
      setTestimonialIndex(0);
    } else {
      setTestimonialIndex((prevState) => prevState + 1);
    }
  };
  const notMobile = useUp(deviceBreakpoint.TABLET);
  if (notMobile) {
    return (
      <TestimonialsDesktop
        onLeftNavClick={onLeftNavClick}
        onRightNavClick={onRightNavClick}
        data={data}
        testimonialIndex={testimonialIndex}
      />
    );
  }

  return (
    <TestimonialsMobile
      onLeftNavClick={onLeftNavClick}
      onRightNavClick={onRightNavClick}
      data={data}
      testimonialIndex={testimonialIndex}
    />
  );
};

export default Testimonials;
