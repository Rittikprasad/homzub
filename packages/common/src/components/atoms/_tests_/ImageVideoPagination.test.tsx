import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { ImageVideoPagination } from '@homzhub/common/src/components/atoms/ImageVideoPagination';

describe('ImageVideoPagination', () => {
  let wrapper: ShallowWrapper;

  it('should match snapshot for IMAGE', () => {
    const props = {
      currentSlide: 1,
      totalSlides: 3,
      type: 'IMAGE',
    };
    wrapper = shallow(<ImageVideoPagination {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match snapshot for VIDEO', () => {
    const props = {
      currentSlide: 1,
      totalSlides: 3,
      type: 'VIDEO',
    };
    wrapper = shallow(<ImageVideoPagination {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
