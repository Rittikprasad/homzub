import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { OnboardingData } from '@homzhub/common/src/mocks/Onboarding';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';

const mock = jest.fn();

describe('Carousel Atom', () => {
  let component: any;
  let props: any;

  beforeEach(() => {
    props = {
      carouselData: OnboardingData,
      activeIndex: 0,
      carouselItem: OnboardingData[0],
      bubbleRef: mock,
      onSnapItem: mock,
      testID: 'carsl',
    };
    component = shallow(<SnapCarousel {...props} />);
  });

  afterEach(() => jest.clearAllMocks());

  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should not call the bubbleref', () => {
    props = {
      ...props,
      carouselItem: mock,
    };
    component = shallow(<SnapCarousel {...props} />);
    component.dive().find('[testID="carsl"]').prop('onLayout')();
    expect(mock).toHaveBeenCalled();
  });
});
