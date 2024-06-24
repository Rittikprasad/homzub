import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';

let props: any;

describe('PaginationComponent', () => {
  beforeEach(() => {
    props = {
      dotsLength: 0,
      activeSlide: 0,
    };
  });

  it('should match snapshot', () => {
    const wrapper: ShallowWrapper = shallow(<PaginationComponent {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
